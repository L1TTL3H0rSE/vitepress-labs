ORG 0000H

m3:     IN 05H          
        
        CPI 10H         
                        
        JC m1           

        CPI 20H         
        JC m2           

        MVI A, 0E0H      
        OUT 05H         
        CALL DELAY      
        
        MVI A, 00H      
        OUT 05H         
        CALL DELAY      
        
        JMP m3          

m1:     MVI A, 07H      
        OUT 05H         
        CALL DELAY      
        
        MVI A, 00H      
        OUT 05H         
        CALL DELAY      
        
        JMP m3          

m2:     MVI A, 18H      
        OUT 05H         
        JMP m3          


DELAY:  MVI B, 0FFH      
m2_d:   MVI C, 0FFH      
m1_d:   DCR C           
        JNZ m1_d        
        DCR B           
        JNZ m2_d        
        RET             