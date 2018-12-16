package edu.upenn.nets212.hw3;
import java.io.IOException;
import java.lang.*;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Hashtable;

import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.mapreduce.Reducer.Context;
import org.apache.hadoop.io.*;


public class IterReducer2 extends Reducer<Text, Text, Text, Text> {
	//input key	userID/interest/aff
		//input value: all vertexes who received weights List: [<userID/int/aff, type, weight>]
		//				ajacency list: [<userID/interest/affliatoin, type>] 
		//operations: 1. sum all the weights from all vertex list and normalize them	
		//			  2. send back all the weights info to the target vertexes	
		//			  3. send the adj list of the source vertex	
		//output key: target vertex <userID/int/aff,type>	
		//output value: source: <userID/int/aff, type, weight>
		//output key: sender vertex <userID/int/aff,type>	
		//output value: ajacency list: [<userID/interest/affliatoin, type>]
		public void reduce(Text key, Iterable<Text> values, Context context) throws IOException, InterruptedException {
			String adjList = "";
			Double sum = 0.0; //sum of weights from vertexes who gets my weights
	        ArrayList<String> arrli = new ArrayList<String>(4); 
	        System.out.println("Start of IterReducer2: " + key.toString());

			for(Text value: values) {
				String temp = value.toString();
		        System.out.println("IterReducer2 value: "+temp);

				if(!(temp.substring(0, 3).equals("adj"))) {
					//these are vertex who have my weights right now, calculate the sum of weights of them!
					arrli.add(temp);
					String[] pair = temp.split(",");
					sum += Double.parseDouble(pair[2]);
				}
				else
					adjList = temp; //store the adjacency list
			}
			
			//now go ever the list again, normalize their weights and tell them what's their new weights from me
			for(int i=0; i<arrli.size(); i++) {
					//these are vertex who have my weights right now, calculate the sum of weights of them!
					String[] pair = arrli.get(i).split(",");
					if(sum != 0.0) {
						Double newWeight = Double.parseDouble(pair[2])/sum;
						String outputValue = key.toString()+","+newWeight;
						context.write(new Text(pair[0]+","+pair[1]), new Text(outputValue));
					}
			}
			//keep my own adjacency list
			context.write(key, new Text(adjList));
		}
}
