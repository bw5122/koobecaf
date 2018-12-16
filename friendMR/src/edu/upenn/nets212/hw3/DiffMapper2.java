package edu.upenn.nets212.hw3;

import org.apache.hadoop.mapreduce.*;

import java.io.IOException;

import org.apache.hadoop.io.*;

public class DiffMapper2 extends Mapper<LongWritable, Text, Text, DoubleWritable> {
	//input key: line#	value: Vertex#, abs weight 
	//output key: 	Vertex#	    Value: weight
	public void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException{
		String[] parts = value.toString().split("\t");
		Double outputDiff = Double.parseDouble(parts[1].split(",")[2]);
		context.write(new Text("dummy"), new DoubleWritable(outputDiff));
	} 
}
