package edu.upenn.nets212.hw3;
import java.io.IOException;
import java.lang.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.mapreduce.Reducer.Context;
import org.apache.hadoop.io.*;


public class InitReducer extends Reducer<Text, Text, Text, Text> {
	//input	key: userID/int/aff, idType	
		//input value: ajacency list: [<userID/interest/affliatoin, type>]
		//output key: userID/int/aff, idType	
		//output value: ajacency list: [<userID/interest/affliatoin, type>]  \t weightsList: [<userID/int/aff, weight=0, type>]
		public void reduce(Text key, Iterable<Text> values, Context context) throws IOException, InterruptedException {
			String outputValue = "adj";
			int count = 1;
			for(Text value: values) {
				if(count == 1) {
					outputValue = outputValue + value.toString();
					count++;
				}
				else
					outputValue = outputValue + ";"+value.toString();
			}
			outputValue = outputValue + "\t"+key.toString()+",0";
			context.write(key, new Text(outputValue));
		}
}
