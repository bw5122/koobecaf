package edu.upenn.nets212.hw3;

import org.apache.hadoop.mapreduce.*;

import java.io.IOException;

import org.apache.hadoop.io.*;

public class DiffMapper1 extends Mapper<LongWritable, Text, Text, Text> {
	//input	userID/int/aff; idType	
	//		ajacency list: [<userID/interest/affliatoin, type>]  \t weightsList: [userID/int/aff, type, weight]
	//output	userID/int/aff; idType	
	//			weightsList: [userID/int/aff, type, weight]
	public void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException{
		String[] parts = value.toString().split("\t");
		if(parts.length <= 2) {
			context.write(new Text(parts[0]), new Text(parts[0]+",0"));
		}
		else
			context.write(new Text(parts[0]), new Text(parts[2]));
		System.out.println("mapper!!!");
	} 
}
