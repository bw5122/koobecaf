package edu.upenn.nets212.hw3;

import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.mapreduce.Mapper.Context;

import java.io.IOException;

import org.apache.hadoop.io.*;

public class IterMapper2 extends Mapper<LongWritable, Text, Text, Text> {
	//input key: userID/int/aff, idType	
	//input value: ajacency list: [<userID/interest/affliatoin, type>]  \t weightsList: [<userID/int/aff, type, weight,>]
	//Opeation	1. Inform every vertex in my weight list what's the weight I get from them right now	
	//			2. Keep the ajacency list				
	//output	for each vertex in weightsList	
	//key:	userID/int/aff, type	value:	target vertex <userID/int/aff, weight, type>
	//key:	target vertex <userID/int/aff, type>	value: ajacency list: [<userID/interest/affliatoin, type>]
	
	public void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException{
		String[] values = value.toString().split("\t");
		String id = values[0];
		String adjList = values[1];
		System.out.println("****mapper: "+id);
		String[] weightsList = values[2].split(";");
		
		//Inform every vertex in my weight list what's the weight I get from them now
		for(String weight: weightsList) {
			String[] weightPair = weight.split(",");
			context.write(new Text(weightPair[0]+","+weightPair[1]), new Text(id+","+weightPair[2]));
		}
		
		//keep my own adj list
		context.write(new Text(id), new Text(adjList));
		
	} 
}
