import { cleanEnv, str, port } from 'envalid';

function validadeEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'production'],
        }),
        MONGO_URI: str(),
        PORT: port({
            default: 3000,
        }),
    });
}

export default validadeEnv;
