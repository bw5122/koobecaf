package edu.upenn.nets212.hw3;
import java.io.IOException;
import java.lang.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.io.*;


public class DiffReducer2 extends Reducer<Text, DoubleWritable, DoubleWritable, Text> {
	//input	key:Vertex value: (oldweight, newweight)
	//output key:maximum value: max in (abs(old-new) list)
	public void reduce(Text key, Iterable<DoubleWritable> values, Context context) throws IOException, InterruptedException {
		Double max = 0.0;
		for(DoubleWritable value: values) {
			if(value.get()>= max)
				max = value.get();				
		}
		context.write(new DoubleWritable(max), new Text());
	}
}
