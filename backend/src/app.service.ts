import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World from Branch Buddy Backend!';
  }

  healthCheck(): { status: string; message: string } {
    return { status: 'UP', message: 'Branch Buddy Backend is running healthy!' };
  }
}
