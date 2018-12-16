package edu.upenn.nets212.hw3;

import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.mapreduce.Mapper.Context;

import java.io.IOException;

import org.apache.hadoop.io.*;

public class IterMapper3 extends Mapper<LongWritable, Text, Text, Text> {
	//input	target vertex <userID/int/aff,type>	source: <userID/int/aff, type, weight>
	//		sender vertex <userID/int/aff,type>	ajacency list: [<userID/interest/affliatoin, type>]
	//output	target vertex <userID/int/aff,type>	source: <userID/int/aff, type, weight>
	//			sender vertex <userID/int/aff,type>	ajacency list: [<userID/interest/affliatoin, type>]
	
	public void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException{
		String[] values = value.toString().split("\t");
		context.write(new Text(values[0]), new Text(values[1]));
	} 
}
