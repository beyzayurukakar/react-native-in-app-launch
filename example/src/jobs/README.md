Jobs:  
A  
B  
C  
D  
E  

## Job A
- no dependency
- runs using **listener middleware**

## Job B
- depends on **A**
- runs using **listener middleware**

## Job C
- no dependency
- runs using **listener middleware**

## Job D
- depends on **A** and **C**
- runs using **listener middleware**

## Job E
- no dependency
- runs using **sagas**

## Job F
- depends on **E**
- runs using **sagas**

## Job G
- depends on **B** and **F**
- runs using **sagas**


