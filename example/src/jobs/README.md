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
- depends on **B** and **D**
- runs using **sagas**


