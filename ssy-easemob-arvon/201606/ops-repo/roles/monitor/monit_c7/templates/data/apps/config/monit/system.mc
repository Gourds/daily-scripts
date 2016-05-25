check system $HOST 
if loadavg (1min) > 20 for 5 cycles then alert
if cpu usage (user)  > 80% for 5 cycles then alert
if cpu usage (system) > 50% then alert
if cpu usage (wait) > 30% then alert
if memory usage > 80% then alert
