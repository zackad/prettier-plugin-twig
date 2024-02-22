{ pkgs, ... }:

{
  # https://devenv.sh/basics/
  env.GREET = "devenv";
  env.NODE_OPTIONS = "--experimental-vm-modules";

  # https://devenv.sh/packages/
  packages = [
    pkgs.nodejs-slim
    pkgs.yarn
  ];

  # https://devenv.sh/scripts/
  scripts.hello.exec = "echo hello from $GREET";

  enterShell = ''
    hello
  '';

  # https://devenv.sh/languages/
  # languages.nix.enable = true;

  # https://devenv.sh/pre-commit-hooks/
  # pre-commit.hooks.shellcheck.enable = true;

  # https://devenv.sh/processes/
  # processes.ping.exec = "ping example.com";

  # See full reference at https://devenv.sh/reference/options/
}
