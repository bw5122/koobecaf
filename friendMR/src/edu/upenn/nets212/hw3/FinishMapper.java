package edu.upenn.nets212.hw3;

import org.apache.hadoop.mapreduce.*;

import java.io.IOException;

import org.apache.hadoop.io.*;

public class FinishMapper extends Mapper<LongWritable, Text, Text, Text> {
	//input	userID/int/aff; idType	
	//	ajacency list: [<userID/interest/affliatoin, type>]  \t weightsList: [userID/int/aff, type, weight]
	//	operation	1. eliminiate all int/aff type vertexes, not sent them to reducer	
	//	output	target vertex <userID, type>	source: <userID, weight>
	//			sender vertex <userID>	ajacency list: [<userID>]
	public void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException{
		String[] parts = value.toString().split("\t");
		String[] id = parts[0].split(",");
		if(parts.length > 2) {
			String[] weightsList = parts[2].split(";");
			for(String weight: weightsList) {
				String[] weightPair = weight.split(",");
				if(weightPair[1].equals("user") && id[1].equals("user")) {
					context.write(new Text(weightPair[0]), new Text(id[0]+","+weightPair[2]));
					System.out.println("Mapper: "+weightPair[0]);
				}
			}
		}
		//send the adjacency list for filtering out friends
		if(id[1].equals("user")) {
			System.out.println("Mapper: "+id[0]);
			context.write(new Text(id[0]), new Text(parts[1]));
		}
	} 
}
