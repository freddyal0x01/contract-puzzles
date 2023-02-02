const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
const { ethers } = require('hardhat');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    const threshold = "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf";

    let validAddress;

    let wallet = ethers.Wallet.createRandom();

    let address = await wallet.getAddress();

    while(!validAddress) {
      if (address < threshold) {
        console.log(`Valid Address: ${address}`);
        validAddress = true;
      } else {
        wallet = ethers.Wallet.createRandom();
        address = await wallet.getAddress();
      }
    }

    const signer = ethers.provider.getSigner(0);

    const validWallet = wallet.connect(ethers.provider);

    console.log(wallet);

    await signer.sendTransaction({
      to: address,
      value: ethers.utils.parseEther("1")
    });

    return { game, validWallet };
  }
  it('should be a winner', async function () {
    const { game, validWallet } = await loadFixture(deployContractAndSetVariables);

    await game.connect(validWallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
