import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, MaxLength, MinLength } from 'class-validator';
import { IsObjectId } from 'src/validators/is-object-id.validate';

export class CloudCreateRequest {
  @ApiProperty()
  @IsObjectId()
  gameId: string;

  @ApiProperty()
  @IsObjectId()
  planId: string;

  @ApiProperty()
  @IsAlphanumeric()
  @MaxLength(50)
  @MinLength(1)
  name: string;
}

export class CloudActionRequest {
  @ApiProperty()
  @IsObjectId()
  dockerContainerId: string;
}

export class GetCloudLogRequest {
  @ApiProperty()
  @IsObjectId()
  dockerContainerId: string;
}
