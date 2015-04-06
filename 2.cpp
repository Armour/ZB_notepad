#include <iostream>

using namespace std;

int zb[10000],n;

int In(){
    for(int i=1;i<n;++i)
        if(zb[i] == zb[n])
            return i;
    return 0;
}

int main(){
    FILE *f;
    char py[6],c,dz[10000][32];
    int k,i,j,x,count,in;
    freopen("a2.txt","r",stdin);
    f=fopen("f2.txt","rb");
    freopen("zb.txt","w",stdout);
    n=1;
    while(scanf("%s %d\n",py,zb+n)!=EOF){
        printf("%s %d\n",py,zb[n]);
        in=In();
        if(in){
            //count=0;
            for(j=0;j<32;++j){
                c = dz[in][j];
                k = 0x80;
                for(x=0;x <8 ;++x){
                    if(c&k) printf("1");
                    else printf("0");
                    k>>=1;
                }
               // if(count&1)printf("\n");
                //++count;
            }
        }
        else{
            //count=0;
            for(j=0;j<32;++j){
                dz[n][j] = c = fgetc(f);
                k = 0x80;
                for(x=0;x <8 ;++x){
                    if(c&k) printf("1");
                    else printf("0");
                    k>>=1;
                }
                //if(count&1)printf("\n");
                //++count;
            }
            ++n;
        }
        printf("\n");
    }
    
    fclose(f);
    return 0;
}
