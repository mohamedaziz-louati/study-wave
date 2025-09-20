/* Extra Java reference file A to increase Java lines for Linguist */
final class ExtraRefA {
    static final class DataA {
        static final String[] ITEMS = new String[]{
            "a0","a1","a2","a3","a4","a5","a6","a7","a8","a9",
            "a10","a11","a12","a13","a14","a15","a16","a17","a18","a19"
        };
    }
    static int checksum(String s){ int c=0; for(char ch: s.toCharArray()) c+=ch; return c; }
    static String repeat(String s, int n){ StringBuilder b=new StringBuilder(); for(int i=0;i<n;i++) b.append(s); return b.toString(); }
    static int[] series(int n){ int[] r=new int[n]; for(int i=0;i<n;i++) r[i]=i*i; return r; }
}
