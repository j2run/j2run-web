import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, MaxLength, MinLength } from 'class-validator';
import { IsObjectId } from 'src/validators/is-object-id.validate';

export class NewSubdomainValidRequest {
  @ApiProperty()
  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(16)
  subdomain: string;

  @ApiProperty()
  @IsObjectId()
  wbDomainId: string;
}
