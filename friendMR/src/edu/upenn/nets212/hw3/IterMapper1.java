package edu.upenn.nets212.hw3;

import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.mapreduce.Mapper.Context;

import java.io.IOException;

import org.apache.hadoop.io.*;

public class IterMapper1 extends Mapper<LongWritable, Text, Text, Text> {
	//input key: userID/int/aff, idType	
	//input value: ajacency list: [<userID/interest/affliatoin, type>]  \t 
	//				weightsList: [userID/int/aff, type, weight]
	//opearations	1. go through the weightsList, find the one with the same ID, if it's user type, then add weight 1 to it	
	//			2. for each vertex in adjacency list, send weights to them form each in-degree source	
	//output key:	receiver(<userID/interest/aff, idType>)	<userID/int/aff, added weight, type>
	//			sender(<userID/interest/aff, idType>)	
	//output value: "adj" + "\t" + ajacency list: [<userID/interest/affliatoin, type>] 
	
	public void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException{
		System.out.println("Value: "+value.toString());
		String[] values = value.toString().split("\t");
		String id = values[0].toString();
		values[1] = values[1].substring(3, values[1].length());
		System.out.println("Mapper ID: "+id);
		System.out.println("size: "+values.length);
		String[] adjList = values[1].toString().split(";");
		String[] weightsList;
		int numOfAdjVertexes = adjList.length;
		String[] newWeightList;
		int updateFlag = 0;
		
		if(values.length <= 2) {
			//entry doesn's have any weightsList
			newWeightList = new String[1];
			newWeightList[0] = id+",1";
			for(String receiverVertex: adjList) {
				for(String weight: newWeightList) {
					String[] weightPair = weight.split(",");
					String weightSource = weightPair[0] + "," + weightPair[1];
					Double weightAmount = Double.parseDouble(weight.split(",")[2])/numOfAdjVertexes;
					String receiverWeight = weightSource + ","+weightAmount;
					System.out.println("Mapper***^^^: "+receiverVertex.toString());
					context.write(new Text(receiverVertex), new Text(receiverWeight));
				}
			}
		}
		else {
			weightsList = values[2].toString().split(";");
			String idType = id.split(",")[1];
			//Shadow vertex add weight 1 to user in every round of iteration
			if(idType.equals("user")) {
				for(int i=0; i<weightsList.length; i++) {
					String source = weightsList[i].split(",")[0];
					if(source.equals(id.split(",")[0])) {
						updateFlag = 1;
						String oldWeight =weightsList[i].substring(weightsList[i].length() - 1);
						int newWeight = Integer.parseInt(oldWeight) + 1;
						weightsList[i] = weightsList[i].substring(0,weightsList[i].length()-1)+newWeight;		
						System.out.println("newWeight of user: "+weightsList[i]);
					}
				}
				if(updateFlag != 1) {
					//user weight is not update in previous loop
					//add weight 1 here manually
					newWeightList = new String[weightsList.length+1];
					newWeightList[0] = id+",1";
					for(int i=1; i<newWeightList.length; i++)
						newWeightList[i] = weightsList[i-1];
					
					for(String receiverVertex: adjList) {
						for(String weight: newWeightList) {
							String[] weightPair = weight.split(",");
							String weightSource = weightPair[0] + "," + weightPair[1];
							Double weightAmount = Double.parseDouble(weight.split(",")[2])/numOfAdjVertexes;
							String receiverWeight = weightSource + ","+weightAmount;
							System.out.println("Mapper***^^^: "+receiverVertex.toString());
							context.write(new Text(receiverVertex), new Text(receiverWeight));
						}
					}
				}
				else {
					for(String receiverVertex: adjList) {
						for(String weight: weightsList) {
							String[] weightPair = weight.split(",");
							String weightSource = weightPair[0] + "," + weightPair[1];
							Double weightAmount = Double.parseDouble(weight.split(",")[2])/numOfAdjVertexes;
							String receiverWeight = weightSource + ","+weightAmount;
							System.out.println("Mapper***^^^: "+receiverVertex.toString());
							context.write(new Text(receiverVertex), new Text(receiverWeight));
						}
					}
				}
			}
			else {
				//if not user, just send weight
				for(String receiverVertex: adjList) {
					for(String weight: weightsList) {
						String[] weightPair = weight.split(",");
						String weightSource = weightPair[0] + "," + weightPair[1];
						Double weightAmount = Double.parseDouble(weight.split(",")[2])/numOfAdjVertexes;
						String receiverWeight = weightSource + ","+weightAmount;
						System.out.println("Mapper***^^^: "+receiverVertex.toString());
						context.write(new Text(receiverVertex), new Text(receiverWeight));
					}
				}
			}
		}
		

		
		String outputValue = "adj"+values[1].toString();
		context.write(new Text(id), new Text(outputValue));
		System.out.println("Mapper***: "+id+"\t"+outputValue);
		
	} 
}
