import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';

@Controller('upload')
export class UploadController {
    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req: any, file: any, cb: any) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    uploadFile(@UploadedFile() file: any) {
        // Return the URL to access the file
        // Assuming the server serves static files from /uploads
        const apiUrl = process.env.API_URL || 'http://localhost:3333';
        return {
            url: `${apiUrl}/uploads/${file.filename}`
        };
    }

    // Simple static file serving if ServeStaticModule is not used
    @Get(':filename')
    serveFile(@Param('filename') filename: string, @Res() res: Response) {
        res.sendFile(filename, { root: './uploads' });
    }
}
