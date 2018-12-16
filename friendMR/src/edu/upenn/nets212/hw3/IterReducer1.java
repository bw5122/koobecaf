package edu.upenn.nets212.hw3;
import java.io.IOException;
import java.lang.*;
import java.util.Enumeration;
import java.util.Hashtable;

import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.mapreduce.Reducer.Context;
import org.apache.hadoop.io.*;


public class IterReducer1 extends Reducer<Text, Text, Text, Text> {
	//input	key userID/int/aff; idType	
	//input value: ajacency list: [<userID/interest/affliatoin, type>]  weightsList: [userID/int/aff, type, weight,]
	//operations	1. use hashtable to calculate the sum of weight from each source	
	//			2. filter out the adj list through traversing	
	//output key	userID/int/aff, idType	
	//output value	ajacency list: [<userID/interest/affliatoin, type>]  \t weightsList: [<userID/int/aff, type, weight>]
	public void reduce(Text key, Iterable<Text> values, Context context) throws IOException, InterruptedException {
		String outputValue="";
		String adjList = "";
        System.out.println("Start reducer*** key: "+key.toString());

		Hashtable<String, Double> h = new Hashtable(); 
		for(Text value: values) {
			String temp = value.toString();
			if(!(temp.substring(0, 3).equals("adj"))) {
				//incoming weight, calculate the total weight sum from this source using hashtable
				String[] pair = temp.split(",");
				String hashKey = pair[0]+","+pair[1];
				if(h.containsKey(hashKey))
					h.put(hashKey, h.get(hashKey)+Double.parseDouble(pair[2]));
				else
					h.put(hashKey, Double.parseDouble(pair[2]));
			}
			else
				adjList = value.toString();
		}
		//reconstruct the weightsList
		Enumeration<String> enu = h.keys(); 
        // Displaying the Enumeration 
        int count = 0;
        while (enu.hasMoreElements()) { 
        	String theKey = enu.nextElement();
        	if(count == 0) {
                outputValue = theKey+","+h.get(theKey);
                count++;
        	}
        	else {
                outputValue = outputValue + ";"+theKey+","+h.get(theKey);
        	}
        }
        outputValue = adjList+"\t"+outputValue;
        System.out.println("reducer*** key: "+key.toString());
		context.write(key, new Text(outputValue));
	}
	
}
