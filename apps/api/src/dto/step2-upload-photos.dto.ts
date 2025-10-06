import { ApiProperty } from '@nestjs/swagger';

export class UploadPhotosResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'Vehicle inspection photos uploaded successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
    type: 'object',
    properties: {
      inspectionId: {
        type: 'number',
        description: 'Inspection ID',
        example: 101,
      },
      photoUrls: {
        type: 'array',
        items: {
          type: 'string',
          format: 'url',
        },
        description: 'Array of uploaded photo URLs',
        example: [
          'https://res.cloudinary.com/.../front.jpg',
          'https://res.cloudinary.com/.../rear.jpg',
          'https://res.cloudinary.com/.../left.jpg',
          'https://res.cloudinary.com/.../right.jpg',
          'https://res.cloudinary.com/.../odo.jpg',
          'https://res.cloudinary.com/.../battery.jpg',
        ],
      },
    },
  })
  data: {
    inspectionId: number;
    photoUrls: string[];
  };
}
