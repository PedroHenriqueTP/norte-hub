import chalk from 'chalk';

export class Logger {
    static info(agent: string, message: string) {
        console.log(`${chalk.blue(`[${new Date().toLocaleTimeString()}]`)} ${chalk.bold.cyan(agent)}: ${message}`);
    }

    static success(agent: string, message: string) {
        console.log(`${chalk.blue(`[${new Date().toLocaleTimeString()}]`)} ${chalk.bold.green(agent)}: ✅ ${message}`);
    }

    static warn(agent: string, message: string) {
        console.log(`${chalk.blue(`[${new Date().toLocaleTimeString()}]`)} ${chalk.bold.yellow(agent)}: ⚠️  ${message}`);
    }

    static error(agent: string, message: string, error?: any) {
        console.log(`${chalk.blue(`[${new Date().toLocaleTimeString()}]`)} ${chalk.bold.red(agent)}: ❌ ${message}`);
        if (error) console.error(error);
    }

    static section(title: string) {
        console.log(chalk.bold.magenta(`\n=== ${title} ===\n`));
    }
}
