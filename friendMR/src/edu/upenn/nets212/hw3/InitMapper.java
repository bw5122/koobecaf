package edu.upenn.nets212.hw3;

import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.mapreduce.Mapper.Context;

import java.io.IOException;

import org.apache.hadoop.io.*;

public class InitMapper extends Mapper<LongWritable, Text, Text, Text> {
	//output key: userID/int/aff, idType	
		//output value: <userID/interest/affliatoin, type>
	public void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException{
		String[] values = value.toString().split(",");
		//calculate the difference
		String outputValue = values[1];
		String outputKey = values[0];
		if(values[2].equals("friend")) {
			outputKey = outputKey+",user";
			outputValue = outputValue+",user";
		}
		else if(values[2].equals("to_interest")) {
			outputKey = outputKey+",user";
			outputValue = outputValue+",interest";
		}
		else if(values[2].equals("to_affiliation")) {
			outputKey = outputKey+",user";
			outputValue = outputValue+",affiliation";
		}
		else if(values[2].equals("from_affiliation")) {
			outputKey = outputKey+",affiliation";
			outputValue = outputValue+",user";
		}
		else {
			outputKey = outputKey+",interest";
			outputValue = outputValue+",user";
		}
		System.out.println("***"+outputKey+"----"+outputValue);
		context.write(new Text(outputKey), new Text(outputValue));
} 
}
