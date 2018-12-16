package edu.upenn.nets212.hw3;
import java.io.IOException;
import java.lang.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.io.*;
import java.util.*; 



public class FinishReducer extends Reducer<Text, Text, Text, Text> {
	//input	target vertex <userID>	
	//list of vertexes who get weights from the target: <userID, weight>
	//operation: 1. filter out existing friendships	sort
	//output	userID	list of userID (recommended friends)
	public void reduce(Text key, Iterable<Text> values, Context context) throws IOException, InterruptedException {
		HashMap<String, Double> map = new HashMap<String, Double>();
        ValueComparator bvc = new ValueComparator(map);
        TreeMap<String, Double> sorted_map = new TreeMap<String, Double>(bvc);
        
        String adjStr = "";
        //construct the map, prepare for sorting
		for(Text value: values) {
			String temp = value.toString();
			if(!(temp.substring(0, 3).equals("adj"))) {
				String[] pair = temp.split(","); //<userID, weight>
				map.put(pair[0], Double.parseDouble(pair[1]));
			}
			else
				adjStr = temp;
		}
		System.out.println("unsorted map: " + map);
		//sort the list
        sorted_map.putAll(map);
        System.out.println("results: " + sorted_map);
        
        //construct the hashtable of exiting frends for filtering later
        Hashtable<String, Double> h = new Hashtable(); 
		String[] adjList = adjStr.split(";");
		adjList[0] = adjList[0].substring(3, adjList[0].length());
		for(int i=0; i<adjList.length; i++) {
			String[] adjPair = adjList[i].split(",");
			System.out.println("adjList "+adjPair[0] + adjPair[1]);
			if(adjPair[1].equals("user")) {
				h.put(adjPair[0], 0.0);	
			}
		}
		
		Enumeration<String> enu = h.keys(); 
        // Displaying the Enumeration 
    	System.out.println("Hashtable");

        while (enu.hasMoreElements()) { 
        	String theKey = enu.nextElement();
        	System.out.println("Hashtable key: "+ theKey);
        }
        
        //construct the recommendation list according to order
        //filter out users who are already friends
		String recFriends = "";
		int count=0;
		int rank = 1;
        for(Map.Entry<String,Double> entry : sorted_map.entrySet()) {
        	  String mapKey = entry.getKey();
        	  Double mapValue = entry.getValue();
        	  System.out.println("recommendation "+rank+": "+mapKey+"\t"+mapValue);
        	  rank++;
        	  if(!(h.containsKey(mapKey)) && !(mapKey.equals(key.toString()))) {
        	      context.write(new Text(key), new Text(mapKey+"\t"+mapValue));
        	  }
        }
     }
}

class ValueComparator implements Comparator<String> {
    Map<String, Double> base;

    public ValueComparator(Map<String, Double> base) {
        this.base = base;
    }

    // Note: this comparator imposes orderings that are inconsistent with
    // equals.
    public int compare(String a, String b) {
        if (base.get(a) >= base.get(b)) {
            return -1;
        } else {
            return 1;
        } // returning 0 would merge keys
    }
}
