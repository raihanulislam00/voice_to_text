"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const dotenv = require("dotenv");
dotenv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    app.setGlobalPrefix('api');
    await app.listen(3000);
    console.log('🚀 Voice to Text API is running on http://localhost:3000');
    console.log('📱 Web Interface: http://localhost:3000');
    console.log('📡 API Endpoint: http://localhost:3000/api/file/upload');
    console.log('💡 Make sure to set GEMINI_API_KEY environment variable for AI features');
}
bootstrap();
//# sourceMappingURL=main.js.map