package edu.upenn.nets212.hw3;
import java.io.IOException;
import java.lang.*;
import java.util.Enumeration;
import java.util.Hashtable;

import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.mapreduce.Reducer.Context;
import org.apache.hadoop.io.*;


public class IterReducer3 extends Reducer<Text, Text, Text, Text> {
	//input	userID/int/aff; idType	ajacency list: [<userID/interest/affliatoin, type>]  
	//								weightsList: [userID/int/aff, type, weight]
	//operations	1. filter out the adj list through traversing	
	//				2. Reforming the weights list together	
	//output	userID/int/aff; idType	
	//			ajacency list: [<userID/interest/affliatoin, type>]  \t weightsList: [userID/int/aff, type, weight]
	public void reduce(Text key, Iterable<Text> values, Context context) throws IOException, InterruptedException {
		String outputValue="";
		String adjList = "";
		int count = 0;
		for(Text value: values) {
			String temp = value.toString();
			//reconstruct the weightsList from the normalized weights
			if(!(temp.substring(0, 3).equals("adj"))) {
				if(count == 0) {
					outputValue = temp;
					count += 1;
				}
				else
					outputValue += ";"+temp;
			}
			else
				adjList = value.toString();
		}
        outputValue = adjList+"\t"+outputValue;
		context.write(key, new Text(outputValue));
	}
}
