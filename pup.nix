{ pkgs ? import <nixpkgs> {} }:

let
  testPupBuild = pkgs.stdenv.mkDerivation {
    pname = "test-pup";
    version = "1.0.1";
    src = ./.; 

    buildPhase = ''
      # No build needed, just copy files
    '';

    installPhase = ''
      mkdir -p $out
      cp -r . $out/
      chmod +x $out/index.js
    '';

    meta = with pkgs.lib; {
      description = "Test Pup for Dogebox testing";
      license = licenses.mit;
      platforms = platforms.unix;
    };
  };

  test-pup = pkgs.writeScriptBin "run.sh" ''
#!${pkgs.bash}/bin/bash
set -e

echo "[RUN.SH] Starting test-pup service..."
echo "[RUN.SH] Test pup directory: ${testPupBuild}"
echo "[RUN.SH] Node version:"
${pkgs.nodejs_22}/bin/node --version

cd ${testPupBuild}
echo "[RUN.SH] Current directory: $(pwd)"
echo "[RUN.SH] Files in directory:"
ls -la

echo "[RUN.SH] Executing index.js..."
exec ${pkgs.nodejs_22}/bin/node ${testPupBuild}/index.js
  '';

in {
  inherit test-pup;
}

