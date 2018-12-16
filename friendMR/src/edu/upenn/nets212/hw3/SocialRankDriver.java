package edu.upenn.nets212.hw3;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FSDataInputStream;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import edu.upenn.nets212.hw3.SocialRankDriver;
import edu.upenn.nets212.hw3.InitMapper;
import edu.upenn.nets212.hw3.InitReducer;

public class SocialRankDriver 
{
  public static void main(String[] args) throws Exception 
  {
    /* TODO: Your code here */    
	switch(args[0]) {
		case "init":
			init(args[1], args[2], Integer.parseInt(args[3]));
			break;
		case "iter":
			iter1(args[1], args[2], Integer.parseInt(args[3]));
			break;
		case "diff":
			//two jobs for diff are set, "temp" is the intermidate directory for two jobs
			//diff1(args[1], args[2], "temp", Integer.parseInt(args[4]));
			//diff2("temp", args[3], Integer.parseInt(args[4]));
			//diff1(args[1],args[2], "kk", Integer.parseInt(args[3]));
			diff2(args[1], args[2], Integer.parseInt(args[3]));
			break;
		case "finish":
			finish(args[1], args[2], Integer.parseInt(args[3]));
			break;
		case "composite":
			composite(args[1], args[2], args[3], args[4], args[5], args[6], args[7], Integer.parseInt(args[8]));
	}
	    
  }
  
  static void init(String inputDir, String outputDir, int numReducer) throws Exception {
	  	System.out.println("WANG Zhiwei (zwangcj)");
	  	deleteDirectory(outputDir);
		Job job = new Job();
	    job.setJarByClass(SocialRankDriver.class);
	    job.setNumReduceTasks(numReducer);
	    // Set the paths to the input and output directoruy
	    FileInputFormat.addInputPaths(job, inputDir);
	    FileOutputFormat.setOutputPath(job, new Path(outputDir));
	    // Set the Mapper and Reducer classes
	    job.setMapperClass(InitMapper.class);
	    job.setReducerClass(InitReducer.class);

	    // Set the output types of the Mapper class
	    job.setMapOutputKeyClass(Text.class);
	    job.setMapOutputValueClass(Text.class);

	    // Set the output types of the Reducer class
	    job.setOutputKeyClass(Text.class);
	    job.setOutputValueClass(Text.class);

	    if(!job.waitForCompletion(true))
	    	System.exit(1);
  }
  
  static void iter1(String inputDir, String outputDir, int numReducer) throws Exception {
	  	System.out.println("WANG Zhiwei (zwangcj)");
		deleteDirectory(outputDir);
	  	Job job = new Job();
	    job.setJarByClass(SocialRankDriver.class);
	    job.setNumReduceTasks(numReducer);

	    // Set the paths to the input and output directoruy
	    FileInputFormat.addInputPaths(job, inputDir);
	    FileOutputFormat.setOutputPath(job, new Path(outputDir));
	    // Set the Mapper and Reducer classes
	    job.setMapperClass(IterMapper1.class);
	    job.setReducerClass(IterReducer1.class);

	    // Set the output types of the Mapper class
	    job.setMapOutputKeyClass(Text.class);
	    job.setMapOutputValueClass(Text.class);
	    
	    // Set the output types of the Reducer class
	    job.setOutputKeyClass(Text.class);
	    job.setOutputValueClass(Text.class);
	    
	    if(!job.waitForCompletion(true))
	    	System.exit(1);
  }
  
  static void iter2(String inputDir, String outputDir, int numReducer) throws Exception {
	  	System.out.println("WANG Zhiwei (zwangcj)");
		deleteDirectory(outputDir);
	  	Job job = new Job();
	    job.setJarByClass(SocialRankDriver.class);
	    job.setNumReduceTasks(numReducer);

	    // Set the paths to the input and output directoruy
	    FileInputFormat.addInputPaths(job, inputDir);
	    FileOutputFormat.setOutputPath(job, new Path(outputDir));
	    // Set the Mapper and Reducer classes
	    job.setMapperClass(IterMapper2.class);
	    job.setReducerClass(IterReducer2.class);

	    // Set the output types of the Mapper class
	    job.setMapOutputKeyClass(Text.class);
	    job.setMapOutputValueClass(Text.class);
	    
	    // Set the output types of the Reducer class
	    job.setOutputKeyClass(Text.class);
	    job.setOutputValueClass(Text.class);
	    
	    if(!job.waitForCompletion(true))
	    	System.exit(1);
}
  
  static void iter3(String inputDir, String outputDir, int numReducer) throws Exception {
	  	System.out.println("WANG Zhiwei (zwangcj)");
		deleteDirectory(outputDir);
	  	Job job = new Job();
	    job.setJarByClass(SocialRankDriver.class);
	    job.setNumReduceTasks(numReducer);

	    // Set the paths to the input and output directoruy
	    FileInputFormat.addInputPaths(job, inputDir);
	    FileOutputFormat.setOutputPath(job, new Path(outputDir));
	    // Set the Mapper and Reducer classes
	    job.setMapperClass(IterMapper3.class);
	    job.setReducerClass(IterReducer3.class);

	    // Set the output types of the Mapper class
	    job.setMapOutputKeyClass(Text.class);
	    job.setMapOutputValueClass(Text.class);
	    
	    // Set the output types of the Reducer class
	    job.setOutputKeyClass(Text.class);
	    job.setOutputValueClass(Text.class);
	    
	    if(!job.waitForCompletion(true))
	    	System.exit(1);
}
  
  static void diff1(String inputDir1, String inputDir2, String diffDir, int numReducer) throws Exception {
	  	System.out.println("WANG Zhiwei (zwangcj)");
	  	deleteDirectory(diffDir);
		Job job = new Job();
	    job.setJarByClass(SocialRankDriver.class);
	    job.setNumReduceTasks(numReducer);

	    // Set the paths to the input and output directoruy
	    FileInputFormat.addInputPaths(job, inputDir1+","+inputDir2);
	    FileOutputFormat.setOutputPath(job, new Path(diffDir));
	    // Set the Mapper and Reducer classes
	    job.setMapperClass(DiffMapper1.class);
	    job.setReducerClass(DiffReducer1.class);

	    // Set the output types of the Mapper class
	    job.setMapOutputKeyClass(Text.class);
	    job.setMapOutputValueClass(Text.class);

	    // Set the output types of the Reducer class
	    job.setOutputKeyClass(Text.class);
	    job.setOutputValueClass(Text.class);

	    if(!job.waitForCompletion(true))
	    	System.exit(1);
  }
  
  static void diff2(String diffDir, String outputDir, int numReducer) throws Exception {
	  	System.out.println("WANG Zhiwei (zwangcj)");
	  	deleteDirectory(outputDir);
		Job job = new Job();
	    job.setJarByClass(SocialRankDriver.class);
	    //testing reducer# 1
	    job.setNumReduceTasks(1);

	    // Set the paths to the input and output directoruy
	    FileInputFormat.addInputPaths(job, diffDir);
	    FileOutputFormat.setOutputPath(job, new Path(outputDir));
	    // Set the Mapper and Reducer classes
	    job.setMapperClass(DiffMapper2.class);
	    job.setReducerClass(DiffReducer2.class);

	    // Set the output types of the Mapper class
	    job.setMapOutputKeyClass(Text.class);
	    job.setMapOutputValueClass(DoubleWritable.class);

	    // Set the output types of the Reducer class
	    job.setOutputKeyClass(DoubleWritable.class);
	    job.setOutputValueClass(Text.class);
	    
	    if(!job.waitForCompletion(true))
	    	System.exit(1);
}
  
  static void finish(String inputDir, String outputDir, int numReducer) throws Exception {
	  System.out.println("WANG Zhiwei (zwangcj)");
	  	deleteDirectory(outputDir);
		Job job = new Job();
	    job.setJarByClass(SocialRankDriver.class);
	    job.setNumReduceTasks(1);

	    // Set the paths to the input and output directoruy
	    FileInputFormat.addInputPaths(job, inputDir);
	    FileOutputFormat.setOutputPath(job, new Path(outputDir));
	    // Set the Mapper and Reducer classes
	    job.setMapperClass(FinishMapper.class);
	    job.setReducerClass(FinishReducer.class);

	    // Set the output types of the Mapper class
	    job.setMapOutputKeyClass(Text.class);
	    job.setMapOutputValueClass(Text.class);

	    // Set the output types of the Reducer class
	    job.setOutputKeyClass(Text.class);
	    job.setOutputValueClass(Text.class);

	    if(!job.waitForCompletion(true))
	    	System.exit(1);   
}
  
  static void composite(String inputDir, String outputDir, String intermDir1, String intermDir2, String intermDir3, String intermDir4, String diffDir, int numReducer) throws Exception {
	  init(inputDir, intermDir1, numReducer);
	  do {
		  iter1(intermDir1, intermDir2, numReducer);
		  iter2(intermDir2, intermDir3, numReducer);
		  iter3(intermDir3, intermDir4, numReducer);
		  
		  iter1(intermDir4, intermDir2, numReducer);
		  iter2(intermDir2, intermDir3, numReducer);
		  iter3(intermDir3, intermDir1, numReducer);
		  
		  diff1(intermDir1, intermDir4, diffDir, numReducer);
		  diff2(diffDir, outputDir, numReducer);
	  }
	  while(readDiffResult(outputDir) >= 0.01);
	  
	  finish(intermDir1, outputDir, numReducer);
  }

  // Given an output folder, returns the first double from the first part-r-00000 file
  static double readDiffResult(String path) throws Exception 
  {
    double diffnum = 0.0;
    Path diffpath = new Path(path);
    Configuration conf = new Configuration();
    FileSystem fs = FileSystem.get(URI.create(path),conf);
    
    if (fs.exists(diffpath)) {
      FileStatus[] ls = fs.listStatus(diffpath);
      for (FileStatus file : ls) {
	if (file.getPath().getName().startsWith("part-r-00000")) {
	  FSDataInputStream diffin = fs.open(file.getPath());
	  BufferedReader d = new BufferedReader(new InputStreamReader(diffin));
	  String diffcontent = d.readLine();
	  diffnum = Double.parseDouble(diffcontent);
	  d.close();
	}
      }
    }
    
    fs.close();
    return diffnum;
  }

  static void deleteDirectory(String path) throws Exception {
    Path todelete = new Path(path);
    Configuration conf = new Configuration();
    FileSystem fs = FileSystem.get(URI.create(path),conf);
    
    if (fs.exists(todelete)) 
      fs.delete(todelete, true);
      
    fs.close();
  }

}
