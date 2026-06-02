import { SetMetadata } from '@nestjs/common';
import { AppSlug } from '@prisma/client';

export const REQUIRE_SUBSCRIPTION_KEY = 'require_subscription';
export const RequireSubscription = (appSlug: AppSlug) => SetMetadata(REQUIRE_SUBSCRIPTION_KEY, appSlug);

export const REQUIRE_FEATURE_KEY = 'require_feature';
export const RequireFeature = (feature: string) => SetMetadata(REQUIRE_FEATURE_KEY, feature);
