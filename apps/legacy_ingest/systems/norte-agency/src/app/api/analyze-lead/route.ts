import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function POST(req: Request) {
    const body = await req.json();

    // Aqui o Next.js chama o seu Maestro Python
    // Passamos os dados via argumento ou variáveis de ambiente
    try {
        const { stdout } = await execPromise(`python3 main.py "${body.nome}" "${body.origem}"`);
        return NextResponse.json({ result: stdout });
    } catch (error) {
        return NextResponse.json({ error: "Erro na Engine Python" }, { status: 500 });
    }
}