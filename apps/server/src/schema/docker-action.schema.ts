import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaDto } from '../dtos/schema.dto';
import { JobDockerStatus, JobDockerType } from 'src/dtos/job.dto';

export type DockerActionDocument = HydratedDocument<DockerAction>;

@Schema({
  timestamps: true,
})
export class DockerAction extends SchemaDto {
  @ApiProperty()
  @Prop({ index: true })
  userId: Types.ObjectId;

  @ApiProperty()
  @Prop({ index: true })
  dockerContainerId: Types.ObjectId;

  @ApiProperty()
  @Prop()
  jobDockerType: JobDockerType;

  @ApiProperty()
  @Prop()
  jobDockerStatus: JobDockerStatus;
}

export const DockerActionSchema = SchemaFactory.createForClass(DockerAction);

DockerActionSchema.index({ userId: 1, dockerContainerId: 1 });

DockerActionSchema.index({
  userId: 1,
  dockerContainerId: 1,
  jobDockerStatus: 1,
});

DockerActionSchema.index({
  userId: 1,
  jobDockerStatus: 1,
});
