; НАЧАЛО ПРОГРАММЫ
        ORG 0000H       
m3:     MVI A, 01H      

m1:     OUT 05H         
        CALL DELAY3      
        
        RLC             
        
        CPI 80H         
        JNZ m1          

        MVI A, 80H      

m2:     OUT 05H         
        CALL DELAY3      
        
        RRC             
        
        CPI 01H         
        JNZ m2          

        JMP m3          

DELAY:  MVI B, 0FFH
m2_d:   MVI C, 0FFH
m1_d:   DCR C           
        JNZ m1_d        
        DCR B           
        JNZ m2_d        
        RET             

DELAY2:  MVI B, 0FFH      
m_d:    DCR B           
        JNZ m_d         
        
        RET             

DELAY3: PUSH PSW        
        
        MVI A, 0FFH      
        MVI B, 00H      
m3_d:   INR B           
        
        CMP B           
        JNZ m3_d        
        
        POP PSW         
        RET             

DELAY4:  MVI A, 0FFH     
        MVI B, 00H      
m_d:    INR B           
        
        CMP B           
        JNZ m_d         
        
        RET             