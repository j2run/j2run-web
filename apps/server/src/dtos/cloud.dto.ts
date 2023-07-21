import { ApiProperty } from '@nestjs/swagger';
import { IsObjectId } from 'src/validators/is-object-id.validate';

export class CloudCreateRequest {
  @ApiProperty()
  @IsObjectId()
  gameId: string;

  @ApiProperty()
  @IsObjectId()
  planId: string;
}

export class CloudActionRequest {
  @ApiProperty()
  @IsObjectId()
  dockerContainerId: string;
}
