import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNumber, IsNumberString, Max, Min } from "class-validator";

export class QueryListDto {
  @Transform(({ value }) => Number(value))
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: "Page 只能为数字" },
  )
  @Min(1, { message: "Page 不能小于1" })
  @ApiProperty({
    required: false,
    default: 1,
    example: 1,
    minimum: 1,
    description: "当前页数",
  })
  page?: number = 1;

  @Transform(({ value }) => Number(value))
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: "pageSize 只能为数字" },
  )
  @Max(100, { message: "pageSize 不能大于100" })
  @ApiProperty({
    required: false,
    default: 10,
    example: 10,
    minimum: 1,
    description: "每页条数",
  })
  pageSize?: number = 10;

  @IsEnum(["id", "createdAt", "updatedAt"], {
    message: "排序字段只能为id、createdAt、updatedAt",
  })
  @ApiProperty({
    required: false,
    default: "id",
    example: "id",
    description: "排序字段",
  })
  sortBy?: string = "id";

  @IsEnum(["asc", "desc"], { message: "排序方式只能为asc或desc" })
  @ApiProperty({
    required: false,
    default: "asc",
    example: "asc",
    description: "排序方式",
    enum: ["asc", "desc"],
  })
  order?: "asc" | "desc" = "asc";
}
