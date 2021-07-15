#!/bin/sh

for i in $(seq 25 $END);
do 
	echo $i;
	curl _serv.cycle/echo;
	sleep 1;


done