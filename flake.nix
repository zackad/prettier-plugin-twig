{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    systems.url = "github:nix-systems/default";
    devenv.url = "github:cachix/devenv";
    devenv.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs =
    {
      self,
      nixpkgs,
      devenv,
      systems,
      ...
    }@inputs:
    let
      forEachSystem = nixpkgs.lib.genAttrs (import systems);
    in
    {
      packages = forEachSystem (system: {
        devenv-up = self.devShells.${system}.default.config.procfileScript;
      });

      devShells = forEachSystem (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = devenv.lib.mkShell {
            inherit inputs pkgs;
            modules = [
              {
                # https://devenv.sh/basics/
                env.NODE_OPTIONS = "--experimental-vm-modules";

                # https://devenv.sh/packages/
                packages = [
                  pkgs.nodejs
                  pkgs.yarn
                ];

                # https://devenv.sh/languages/
                # languages.nix.enable = true;

                # https://devenv.sh/pre-commit-hooks/
                # pre-commit.hooks.shellcheck.enable = true;

                # https://devenv.sh/processes/
                # processes.ping.exec = "ping example.com";

                # See full reference at https://devenv.sh/reference/options/
              }
            ];
          };
        }
      );
    };
}
