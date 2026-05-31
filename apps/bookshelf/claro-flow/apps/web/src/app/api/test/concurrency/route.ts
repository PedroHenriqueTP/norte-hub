import { NextResponse } from 'next/server'
import { dbService, readFallbackData, writeFallbackData } from '@/utils/db'

export async function GET() {
  const logs: string[] = []
  let allTestsPassed = true

  const log = (msg: string) => {
    logs.push(msg)
    console.info(`[CONCURRENCY_TEST] ${msg}`)
  }

  try {
    log('--- STARTING CONCURRENCY & CHECKOUT REFUND TESTS ---')

    // 1. Setup mock data in fallback
    const data = readFallbackData()
    
    // Create test user with 100 points
    const testUserToken = 'TSTUSR'
    const testUserId = 'test-user-concurrency-id'
    
    // Remove if exists
    data.userEvents = data.userEvents.filter(u => u.qrCodeToken !== testUserToken)
    data.userEvents.push({
      id: testUserId,
      eventId: 'f1-interlagos',
      name: 'Test Concurrency User',
      email: 'test.concurrency@claro.com.br',
      qrCodeToken: testUserToken,
      totalPoints: 200
    })

    // Create test gift with stock 2 and cost 50 points
    const testGiftId = 'test-gift-concurrency'
    data.gifts = data.gifts.filter(g => g.id !== testGiftId)
    data.gifts.push({
      id: testGiftId,
      eventId: 'f1-interlagos',
      name: 'Mini Capacete Claro F1',
      pointsCost: 50,
      stock: 2
    })

    // Clean redemptions for test user
    data.redemptions = data.redemptions.filter(r => r.userEventId !== testUserId)
    writeFallbackData(data)
    
    log(`Seeded test user (200 pts) and test gift (stock: 2, cost: 50 pts).`)

    // ----------------------------------------------------
    // TEST 1: Concurrency Stock depletion
    // ----------------------------------------------------
    log('Running Test 1: Stock depletion under concurrent checkouts...')
    
    // Attempt 3 simultaneous checkouts. Since stock is 2, only 2 should succeed, 1 should fail.
    const promises = [
      dbService.checkoutRedemption(testUserToken, testGiftId).catch(err => ({ success: false, error: err.message })),
      dbService.checkoutRedemption(testUserToken, testGiftId).catch(err => ({ success: false, error: err.message })),
      dbService.checkoutRedemption(testUserToken, testGiftId).catch(err => ({ success: false, error: err.message }))
    ]

    const results = await Promise.all(promises)
    const successes = results.filter((r: any) => r.success)
    const failures = results.filter((r: any) => !r.success)

    log(`Concurrent results: ${successes.length} successes, ${failures.length} failures.`)

    if (successes.length === 2 && failures.length === 1) {
      log('✅ Test 1 Passed: Correct stock depletion under concurrent checkouts.')
    } else {
      allTestsPassed = false
      log('❌ Test 1 Failed: Concurrency stock mismatch.')
    }

    // Verify current state (points should be 200 - 50*2 = 100, stock should be 0)
    const checkStateData = readFallbackData()
    const checkUser = checkStateData.userEvents.find(u => u.id === testUserId)
    const checkGift = checkStateData.gifts.find(g => g.id === testGiftId)

    log(`User points: ${checkUser?.totalPoints} (expected: 100), Gift stock: ${checkGift?.stock} (expected: 0)`)
    
    if (checkUser?.totalPoints === 100 && checkGift?.stock === 0) {
      log('✅ Test 1 State Verification Passed.')
    } else {
      allTestsPassed = false
      log('❌ Test 1 State Verification Failed.')
    }

    // ----------------------------------------------------
    // TEST 2: Timeout and Cleanup Refund
    // ----------------------------------------------------
    log('Running Test 2: Automatic refund on expired pending checkouts...')

    // Force expire one of the pending redemptions in memory
    // Let's find one in memory and alter its expiration
    const pendingList: any = (global as any).pendingRedemptions || []
    const userPending = pendingList.filter((p: any) => p.userEventId === testUserId)

    if (userPending.length > 0) {
      log(`Found ${userPending.length} pending checkouts. Expiring one of them...`)
      userPending[0].expiresAt = Date.now() - 1000 // Set to past
      
      // Run cleanup
      await dbService.cleanupExpiredRedemptions()
      
      // Verify points and stock are restored (should be points = 150, stock = 1)
      const afterCleanupData = readFallbackData()
      const afterUser = afterCleanupData.userEvents.find(u => u.id === testUserId)
      const afterGift = afterCleanupData.gifts.find(g => g.id === testGiftId)
      
      log(`After cleanup - User points: ${afterUser?.totalPoints} (expected: 150), Gift stock: ${afterGift?.stock} (expected: 1)`)
      
      if (afterUser?.totalPoints === 150 && afterGift?.stock === 1) {
        log('✅ Test 2 Passed: Cleanup refunded points and restored stock correctly.')
      } else {
        allTestsPassed = false
        log('❌ Test 2 Failed: Refund values are incorrect.')
      }
    } else {
      allTestsPassed = false
      log('❌ Test 2 Failed: No pending redemptions found for test user.')
    }

    // ----------------------------------------------------
    // TEST 3: Confirm remaining check-out (no refund)
    // ----------------------------------------------------
    log('Running Test 3: Confirm checkout...')
    const remainingPending = pendingList.find((p: any) => p.userEventId === testUserId)
    
    if (remainingPending) {
      log(`Confirming redemption for token: ${remainingPending.token}`)
      const confirmResult = await dbService.confirmRedemption(remainingPending.token, 'PROMOTOR_TEST', 'DEV_STATION_1')
      
      if (confirmResult.success) {
        log('✅ Test 3 Passed: Confirmation completed successfully.')
      } else {
        allTestsPassed = false
        log('❌ Test 3 Failed: Confirm method returned false.')
      }
      
      // Run cleanup again to make sure it doesn't affect the confirmed redemption
      await dbService.cleanupExpiredRedemptions()
      
      // Verify values are still points = 150, stock = 1 (remains redeemed, not refunded)
      const finalData = readFallbackData()
      const finalUser = finalData.userEvents.find(u => u.id === testUserId)
      const finalGift = finalData.gifts.find(g => g.id === testGiftId)
      const finalRedemption = finalData.redemptions.find(r => r.userEventId === testUserId && r.giftId === testGiftId)

      log(`Final State - User points: ${finalUser?.totalPoints} (expected: 150), Gift stock: ${finalGift?.stock} (expected: 1), Redemption record count: ${finalRedemption ? 1 : 0}`)
      
      if (finalUser?.totalPoints === 150 && finalGift?.stock === 1 && finalRedemption) {
        log('✅ Test 3 State Verification Passed.')
      } else {
        allTestsPassed = false
        log('❌ Test 3 State Verification Failed.')
      }
    } else {
      allTestsPassed = false
      log('❌ Test 3 Failed: Remaining pending checkout not found.')
    }

    // ----------------------------------------------------
    // Cleanup mock data
    // ----------------------------------------------------
    const finalCleanData = readFallbackData()
    finalCleanData.userEvents = finalCleanData.userEvents.filter(u => u.id !== testUserId)
    finalCleanData.gifts = finalCleanData.gifts.filter(g => g.id !== testGiftId)
    finalCleanData.redemptions = finalCleanData.redemptions.filter(r => r.userEventId !== testUserId)
    writeFallbackData(finalCleanData)
    log('Cleaned up test data from database fallback.')

    return NextResponse.json({
      success: allTestsPassed,
      results: logs
    }, { status: allTestsPassed ? 200 : 500 })

  } catch (error: any) {
    log(`FATAL ERROR DURING TESTS: ${error.message}`)
    return NextResponse.json({
      success: false,
      error: error.message,
      results: logs
    }, { status: 500 })
  }
}
