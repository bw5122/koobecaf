package edu.upenn.nets212.hw3;
import java.io.IOException;
import java.lang.*;
import java.util.Enumeration;
import java.util.Hashtable;

import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.io.*;


public class DiffReducer1 extends Reducer<Text, Text, Text, Text> {
	
	public void reduce(Text key, Iterable<Text> values, Context context) throws IOException, InterruptedException {
		//input	userID/int/aff; idType	two weightsList: [userID/int/aff, type, weight]
		//		operation	1. use hashtable to calculate diff of each source	
		//			2. findout the maximum diff	
		//output	diff	maximum diff
		System.out.println("************reducer********");
		Double maxDiff = 0.0;
		String sourceMaxDiff = "";
		Hashtable<String, Double> h = new Hashtable(); 
		for(Text value: values) {
			String temp = value.toString();
			String[] weightLists = temp.split(";");
			for(String item: weightLists) {
				String[] weight = item.split(",");
				String hashKey = weight[0] + ","+weight[1];
				if(h.containsKey(hashKey))
					h.put(hashKey, Math.abs(h.get(hashKey)-Double.parseDouble(weight[2])));
				else
					h.put(hashKey, Double.parseDouble(weight[2]));
			}
		}
		//go through the whole hashtable to find maxDiff
		Enumeration<String> enu = h.keys(); 
        // Displaying the Enumeration 
        while (enu.hasMoreElements()) { 
        	String theKey = enu.nextElement();
        	if(h.get(theKey)>=maxDiff) {
        		maxDiff = h.get(theKey);
        		sourceMaxDiff = theKey;
        	}
        }
		context.write(key, new Text(sourceMaxDiff+","+maxDiff));
	}
}
