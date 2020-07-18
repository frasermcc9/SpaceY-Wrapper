export class Setup {
	public static socketPort: number = 8000;
    public static socketUrl: string="http://localhost:"
    
    public static restPort: number = 3000;
    public static restUrl: string="http://localhost:"

	public static changeSocketPort(port: number) {
		Setup.socketPort = port;
	}
	public static changeRestPort(port: number) {
		Setup.restPort = port;
    }
    
    public static changeSocketUrl(url: string) {
		Setup.socketUrl = url;
	}
	public static changeRestUrl(url: string) {
		Setup.restUrl = url;
	}
}
