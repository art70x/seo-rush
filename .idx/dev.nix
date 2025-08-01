# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs }: {
  channel = "stable-25.05"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.nodePackages.pnpm
  ];
  env = { };
  idx = {
    extensions = [
      "EditorConfig.EditorConfig"
      "esbenp.prettier-vscode"
      "bradlc.vscode-tailwindcss"
    ];
    workspace = {
      # Runs when a workspace is first created with this `dev.nix` file
      onCreate = {
        pnpm-install = "pnpm i --frozen-lockfile --prefer-offline --reporter=silent";
        # Open editors for the following files by default, if they exist:
        default.openFiles = [
          "src/app/page.tsx"
        ];
      };
      # To run something each time the workspace is (re)started, use the `onStart` hook
    };
    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          command = [ "pnpm" "dev" "-p" "$PORT" "--hostname" "0.0.0.0" ];
          manager = "web";
        };
      };
    };
  };
}
