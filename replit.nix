{ pkgs }: {
	deps = [
		pkgs.dotnet-netcore
  pkgs.sudo
  pkgs.nodejs-16_x
        pkgs.nodePackages.typescript-language-server
        pkgs.yarn
        pkgs.replitPackages.jest
	];
}