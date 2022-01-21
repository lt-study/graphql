import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import {ObjectType, Field, Int} from "type-graphql";

@ObjectType() // GraphQl type
@Entity()
export class Post {
    @Field(()=> Int) //define graphql type
    @PrimaryKey()
    id!: number;
    
    @Field(() => String)
    @Property({type: 'date'})
    createdAt = new Date();
    
    @Field(() => String)
    @Property({type: 'date',onUpdate : () => new Date()})
    updatedAt = new Date();
    
    @Field()
    @Property({type: 'text'})
    title!: string;
}