// Allows one to interact with already deployed contract
const { ethers, upgrades } = require("hardhat");
const { setTimeout } = require("timers/promises");

async function main() {

    // Following code is to use the contract at the deployed address
    const deployedAddress = "0xF5eeAA545ffD7634aa58Aa2Eb08354f76477E9cF";
    const ContractFactory = await ethers.getContractFactory("FerroCardRewardFunnel");
    const contract = await ContractFactory.attach(deployedAddress);
    console.log("FCRF: connected to FCRF Card smart contract");

    const [owner,,,,,,,,,contractOwner] = await ethers.getSigners();
    console.log("Interacting with contracts with the account:", owner.address);

/*
    // Pause token trading and transfers
    console.log("Pausing token trading and transfers...");
    await contract.pause();
    console.log("Token trading and transfers paused.");
*/

/*
    // Unpause token trading and transfers
    console.log("Unpausing token trading and transfers...");
    await contract.unpause();
    console.log("Token trading and transfers unpaused.");
*/

/*
    // Deposit tokens into the Ferro Reward Funnel
    const amount = ethers.parseEther("2500000"); // 2.5 Million tokens
    const tokenAddress = "0xb45fC65405B1a28Bb24AF49fe2caa278525Fe977"; // Address of the token

        // First, approve the contract to spend tokens on your behalf
        const tokenContract = await ethers.getContractAt("IERC20", tokenAddress);
        console.log("Approving contract to spend tokens...");
        const approvalTx = await tokenContract.approve(deployedAddress, amount);
        await approvalTx.wait();
        console.log("Contract approved to spend tokens.");

    console.log("Depositing tokens into the Ferro Reward Funnel...");
    await contract.depositTokens(amount, tokenAddress);
    console.log("Tokens deposited into the Ferro Reward Funnel.");
*/

/*
    // Airdrop tokens for Iron tier
    console.log("Airdropping tokens for Iron tier...");
    const batchNum = 0;
    for (let i = 0; i < 12; i++) {
        await contract.airdropTokensIron(i);
        console.log("Airdroped Batch Number: ", i);
        await setTimeout(8000);
    }
    // await contract.airdropTokensIron(batchNum);
    console.log("Tokens airdropped for Iron tier.");

    await setTimeout(8000);


    // Airdrop tokens for Nickel tier
    console.log("Airdropping tokens for Nickel tier...");
    for (let i = 0; i < 12; i++) {
        await contract.airdropTokensNickel(i);
        console.log("Airdroped Batch Number: ", i);
        await setTimeout(8000);
    }
    console.log("Tokens airdropped for Nickel tier.");

    await setTimeout(8000);

    // Airdrop tokens for Cobalt tier
    console.log("Airdropping tokens for Cobalt tier...");
    for (let i = 0; i < 12; i++) {
        await contract.airdropTokensCobalt(i);
        console.log("Airdroped Batch Number: ", i);
        await setTimeout(8000);
    }
    console.log("Tokens airdropped for Cobalt tier.");
*/


/*
    await setTimeout(8000);
    // Update recipients
    const recipientAddresses = [
        '0xc09459DF0D717a7d0681b8fE6F7A115c21C58182',
'0x2385233abb910357e2b97A16D40e0443e53d0769',
'0x60fa9AF30Aecfc7D27d093A4160174Ef94C50d2c',
'0xC610b045Ec1336381dB01810528CDEdc2299b8B5',
'0xFdADeb3AB07F7Ec4C66770339679eA6C28cD0A88',
'0x134B1a31f429BB8C4F1d7Aee40A2AB06b26d0801',
'0xB6a423F6f0935d6B951c45b6572cBAB33D6359e2',
'0xF631938C3BAc0656eB8D25e6BA9e4a5433006654',
'0x2F6F40da6DBA834D6Ab6f62a93bC606733737Fd5',
'0xE804558d4b31b7D05f567ae200cEE98a7364E0A8',
'0xfde25e4a3B64A7470E55705A02Dc3d2628602773',
'0x64535D0cBeeab04A7c2c5b09dFB0F22e57171279',
'0xF50E16E74C46Bd64998B4B2642a15C724E11a298',
'0x57967be4B1778512b34f6dcd4344E30E62887Dde',
'0x54d177B140Da37b6CCD2a86cc8144dC5Bc1a4Bf2',
'0x4216c6B468724e72b4791C6483a5eB5d29e75dEB',
'0x6290408C3Aa8F323FD9a059DDfdc625458FE07c2',
'0xeCD7b5174fd150c375Abdcb6F7BF47BAcfb660AF',
'0x4B45AF7CA432065533CC5243C41B3eBf1F9Fa702',
'0x7212c5027D40AF7a2b2f93Ea38498be7Bc7E7DFc',
'0xF06b4EB15Ae807E822022D5432a7F06a100e6AD4',
'0xa3Cc3893B0D952c312AfBD42d48d5b3B1Ac177fF',
'0x68Af36cE3670FeC12ce53dbc8efbdE3Ab87a96f3',
'0x7B3fc8884f69A30bea47013961E06c54fC003Ad3',
'0x8fdA1EAd2709923C058217B441EF5a5Bf09f4022',
'0xC19b22945fb4CEe4FFA784ac0187B4a5c91D2B38',
'0x346077d6355B14ceC5c63C0491736b7704c70991',
'0x5f9EE29D0BB5ef7605766cf28C8D93fc970CAc71',
'0x207250D8222881750017b43800330Bdb098B7013',
'0xdF721168aba9E53fd440c650Fc960F6A616592F9',
'0xD327b1B0106CBDa9F8d61850ECB18456b4aeD805',
'0x160CD274D091a5b054b587e81eAC9860e4291A39',
'0x68774a38142D6d8fD582d9d5b02521a8b0e54803',
'0xF76953C55d0Cd46fb775Ab269028362D67A6b40D',
'0x8759450d6272505A128410e6477318c70D91472b',
'0x2F7E5D16E00C2dB6033cF5bCaB39D84c521A7eb5',
'0x28E690b76a30fF912af2c5BBe90390f6BCB4D4dC',
'0x90091297bbCB35C8c76A7aae7784D0B038b54c46',
'0xF973BE91CDE91B20f6925fCccb1C8207378B9d82',
'0xc67505621eae3aA54A12DB52a6D101a3AbF2365c',
'0xdA38Bb65C07A1e33ED98944095f39bF431B6770a',
'0x897Ba4a9385F101a737f3E508eA347Ef28DA4B97',
'0x550B11Dfb10C6e4764b09EDaB0562822e5B74C36',
'0xf3F39A5d1f439d0a1a5bDc520177345FA0F331da',
'0x643bB72735E4912bD1A194A1C1517A5DcEDbBfa8',
'0x2Af4962a1765198Ce599E59c2Ab325aD9D5f1d98',
'0x667662CfCCdE43380Ad7382966cAFd95add31A8b',
'0x6E98797a3b0a6B02819a46975F3aaC8d8b19604E',
'0x30b72c92a131cbeCd4d8f31C9226808cE78359C6',
'0x3D387D3db4c4C99C72E685bAb4aa7015f994CC7E',
'0xf5908c56FB645ED954bD26c784F4A1439ebF4dB8',
'0x75D0E59e954AC655e20eC8419fDa6415a7F7d0b2',
'0x93d3Be2672d4f93a15b138D16a352Fe60D28aFF6',
'0x8C6377fa24786CdA16Fdc68566CCca68A55fF09B',
'0x53668Bc34Ee6716D09C66Dc99ED1cBd64c44a160',
'0x6D469BE4Dc8DA9aA7AF735D5E097A458dfeffb19',
'0x1Ec10E6826b9343e13Ce0Cc71f5206b0C5cDa86e',
'0x15fB8860c342b857720A5B0411e0307cd1584578',
'0x28984CCE11c0950C26FfF1c377cC795815493E00',
'0x3401840D207e5D456aE0B6cEe559C072C974A206',
'0x6Fb8d531294Cdd7D664D25589917196975444310',
'0x50b08000349525C10400ff31c39bDe3965709d32',
'0x15042f8A211991A003075dD1978b95A8b86cf31C',
'0x73E659b2eEd6cb347F4cc8F36742AF2570E194FA',
'0x4c19f7E367517fee82d655370336E2d724166fCF',
'0x54943f7F82b689bb4315AD42392883c6a0C93713',
'0x4Ae1D228796837c0bbb08Ea09241Bc2b2A3fc9e3',
'0x0eE203Ac05034604510AEca1A6864ed66E19b760',
'0xef547b4629f5F369ceD63EB9C9E7847f723BE4C4',
'0xA22524573349434b061Db5fdAe0C5b99768B640c',
'0x07d61671C4A12da2c02C69179e5f81f851614c4b',
'0x2D8967B967EEa882AA44f8924c5D5e6D6a0a1e9d',
'0x224bC9fe2924C82aceeA6B3881C91Ee262ba4aAA',
'0x5b600856c7555DD90436C61141d00dBAd2EE9d2a',
'0x52CAeD46A473a4473527B2BCf38B04444c23bAB2',
'0x4B87B8037340Cd432b7583f82A5466F011C5CdC4',
'0xDDD924f42ACD939b7E63f44009a17b855e1c60a1',
'0x6E85929Cb0E92269E5ff5fd6a6cd3F378C41b316',
'0x6A9038876BA9D0ACAd90060a0D7BDad6321BE49b',
'0xBA3614e031EfCF5e7D841b9014108Eb9014f110c',
'0xB824a716E5b8B6Cc28B15aaF04d424D50Aa75C99',
'0x2f587A25f56F5aaf30cE5213f0d3870699916881',
'0x5385CdE5e38C57DD90C4aC7F79659dbCAa1d55d7',
'0xbC94A68d6484cbb70461673eF0bfe3605779d170',
'0x896762ae02A74F1ed452D00A356c8144CE4Ef4f2',
'0x13285463F7eC210454B56fde2c84Ed3a78620770',
'0x0C911eFaA532d5eaF1C0c86D3a34370496645e88',
'0x9A25ba57c02c7c0Af0099f876DA29C6051B16795',
'0xe38c39c63b20Fc130bA179f18939778a0EC9E581',
'0xDC5b5CA71e53fd2672D46e26b7A949DffD933246',
'0x52187EF81f52a282c4a3F743b023198a40AFd293',
'0x8C25632048Fde94511Ba7DA5785CBfCa179f6b77',
'0x82DBC67C8eeFcD4113cD3A717d3dBDD3D7878d01',
'0x8900d56EA5a1Db23AB9Fd5A509e6Ecbd3B963003',
'0xd28797fBF3212bCf0091C92d97169F9200d0D212',
'0x5959b0D9d9f7995747582E66E9A42D69ae356FBC',
'0xa3f0416e7aa28342bc241f9e1Bbc5C4C8c646E39',
'0x8418626867183397355AFB3eBA16442c1eCC23c9',
'0xb7a86A7cC4034e3D4c5B0D8bb9BF673560a12313',
'0x3eb9Ab7DE16B9D768E894a22E2E8B10EbA842954',
'0x9540f81A34A56e8A84A8ACDA49615DCc357A7593',
'0x501520041Cd2C1Ea37A82b14A903C2F388F9Cb2e',
'0x814B283f07B26c13CFB1A31df0306475060018CC',
'0x0817387ace6654eed1D350e989301ca00B72f68E',
'0xbbfa0a6db68bC4Dd4D443f1E161702D747923E22',
'0x693145eeAFd4096334577263Fb7e6A33A28d2861',
'0xF0b72D808a8639c37cd4a9839Ab19EB84150365e',
'0x20266F5bC7a5639Ef7A570456E5047CE18714eF9',
'0xE0BfaBB7546849E0fE3d9A205fe0809d1EF7ACa2',
'0x9Ec8CdAC8F8833B1895578e7f8dfcAE02E2503F5',
'0xd9ed5A0891f96b325216E3BF6551718DB6B77F6d',
'0x579a995A6e4FD1138E879E85Ce45455EA1B0547D',
'0x5e66683B046D41a6C1cBbf7ca9a8b19B5EA4Fec1',
'0xe575c21aD65adCbCb1df8d805C9E3004f78C3A1E',
'0x12D9771CDE173bE7D9a08ba174573b57bc15f1b6',
'0x6f7e861b4Dfc55357360Ad2adA01BB8fC4Eec80f',
'0xd51cac070c18d9086CDE11672fAaf62Ab1458b9f',
'0xAD8904D6563E3348b178ddCf49B312137C992e51',
'0xa3D00eBb5e384463Bf5e18BC76fa55E4823E8212',
'0xCb339726C2EE68f5EB399B12061F30D6b6679F20',
'0xAF69fB16Aa1d09e10eaCCcE7Da139Ac22194086C',
'0x521982d25E5DaE7a88557dA0851628c429b28ba9',
'0x417Ac092595cCAdabbB11086C020d16F14284fB8',
'0x693B7c6bceD40c1bEA99A4737870D6384B2315d4',
'0x01F51d7BDE872A64D197A081934B601aB987b0d5',
'0xc31351Ae2de6dD4b28eDe52BD58B0628Ce3B8Cf5',
'0x9B2Cbc10165985c79B446e8Bcd4e87fb241e614A',
'0x56a0d5c062e090fa22B9357053C1D071f791eb83',
'0xE73E1cBEa54A1b3f8D5543E9D255e9B0793a2607',
'0xB78A9FFf79482A4A083Bdf9952DF5756d5252BC9',
'0x5d6836f641FfFe6a86799B51A4BDed07148760cA',
'0xa1090738b0Af70A60a62a19De9aAE0D9639EAf64',
'0x43aD69276e46D0de63Ae9C34510E0982E628bc26',
'0xE066dA3d20735948FFCd9D584D5918a51a1f9F6C',
'0x5AeF6343324e0441315a9C96946f828F90C8626f',
'0x32836982989ceEd9646c0d27e279AD3992C38265',
'0x673A08Ef71EEb6C238c050fAdf6C3Dd308DDD479',
'0xe3E230516E3423C4F7dF7A34C8c3316e7800E615',
'0xaD485B130deFBD384E54DAC47e8651EC1bb2bd7f',
'0xcD9b25C804419980f677196e948b8a431a1A398c',
'0x345b5aA7965c9174b2863a0539f814b5B37a711E',
'0x733f8254E6Db9EDdFe8aA242552F40c1138dC86C',
'0xeF0DB78BcdC50651864B71e6324b08569477B80a',
'0x0494BA7e357d34678978e4450fc10f429b9e25F2',
'0xdaea84dE1D003ca11DF87A669d8cdc97d1D3ED59',
'0x6862F9d6DCB2e88E44aCA389baB2F395b46414Cd',
'0x978C94F0aAbEb9609AAf3C6a0e668F3e49981dF0',
'0x29d6Bb1C67004e70a90bFd56609bCA1Ea1439566',
'0x15305921e415fEE6AA0B10658a3b25577911e3cF',
'0x3CEDDf30635361C871Fc76a051982F4872597B2D',
'0x2310a349E1936b6eFf35e2faf3e4f981C4f16365',
'0x7173eE579e670ECD5c2bc2b521e802C4d3860948',
'0xb9D28C90ef1e5dEfF21d92aeBfe67cFd86c6B070',
'0x791510F103AC73770ec19e80D8Ca3Ef0Fd4e54ED',
'0x3e2B020BD116b33D69771F745ec989adDCF63849',
'0x0933EFE1B4BE9a9E15a8d6469ef453E405BEF526',
'0xE575dD18c6aE6C5A4Ea544897f48c30ba18E75b0',
'0x47D574e85DF71a059Ec442cAd8DeE2224F58b0D8',
'0xD6827f8503883F2Ed067084596a426dc5228Ccdd',
'0x46E9b39248b8eDBC78CD8ee550f71875e5297319',
'0x7F1DCdb5adBcce0e19e65ED0E3f65B6c4EA7986E',
'0x49fb97cD2c812d06728eA8f79A7A846dDc4C6c90',
'0x377AC2A3adA0952e54F538e51865DfC5FABcAEd7',
'0x71cf9A0bb5a610CF7710AEC4eB96620EcaA476E5',
'0x6C0960af5fa60Bc5327546a67CF173bEeEdbc5F7',
'0x5C8a014Ef57f5649D95FcE6Ced4aC9005A6aF8AB',
'0xb86dD34283457e9aF9AB12f03e434858BDbdA916',
'0xc1B674C26010f5B98747aAe053f43E44D2bB94D6',
'0xb4aa9E7F8893fb30abfa4B23F11E8CB47C30738C',
'0x34E3793D17855F453A7c0FFA32F82b4e3F1bC925',
'0xAb771BE5Df69b8f5820bC44F2dF14cFf04Ea90A3',
'0xF99220eBC04de3488E4d3BC1b104e83A75bB137a',
'0x049CC7022a82015C408C69407Fe833897A687B25',
'0x81116984aD9938202E1a45A6057C2fc872aDaa29',
'0x0ac6f8dE228b998AcF901b1e9f22D3dE407B5110',
'0x7A727C4b191a02156E852201dC8BaFF69400f152',
'0xC2c0F933f53dcc060E8eEbf275e656402acd5550',
'0x32d3e21b38992cdF859c7211Cea49BD95791Fe7f',
'0x05734eBb790732734B48F4a464aD21BDe659758f',
'0x3A05848ab49F27B04e0bcFEe5888a14a60Df3439',
'0xFd5EACdE8D00dD48F2993581cCD302441666F938',
'0xA9F5bFF117DCFA12341b5834daBCd048a67930CC',
'0x06b6b236C095e477C61bDdA545a2b6Db12881Ec5',
'0xF8a6dbc20876FD5657C791be24C92F2ba8C9b634',
'0x18C30251ADAE03701cC240641b6C3725639b5aDD',
'0xD421B58af6e1DdEc7d0C0c3ACeE67EDeD59FAE84',
'0x6c2b03A2fFE7C4FF8BAC97102C76914EC0A97AB5',
'0xe5A66c73A1A549b5AcDeF3FcCfc8d2bc4d3269C4',
'0xcB4f9A94363D688E11f5F3d87814aA492092ff97',
'0xd08eA59Ed96564AF8a871eCA6b1FfAD8D31E654F',
'0xae6AC4CDD6fB5d0C8b11313B8a1a6A5b90eEA534',
'0x2425756033EF4F7315107d7CbeAdD65aAB26FC7d',
'0x24491c8E9158B1B18Ed0A82c6Db1D90c002BF2e6',
'0x0B85Ac6a7cFa64ce36EFF359d19350C9EdEA7841',
'0x5A96d23915f341B27B6C19f228400D51ca1aFd3a',
'0x73D3370B6088416AebbF486031Be3E1849810264',
'0xdB968ba83200aE3Cf39c673CEa89E1A91D50d97f',
'0x57a8E5FC7B79E9eF99d6964ED80639ea2c8993f2',
'0x85FD76654d6E691db87a24f1F17b04140cb669F4',
'0x824dbDB7a4411eCf31A4258b22CDa93E983c6DBC',
'0x7b0F9B85Cb9B28FFAE9AE52EC578FB5102D7c922',
'0x74458119e9c12860f437B0A93681A5794bCBFC09',
'0xFC110131F24c3cD7094FAf9E51635a22Be30D8A0',
'0xE11e04A2E87C368910E3Cd78F98a9042DEc204e5',
'0xDbfBA8479234d6e84dbCC34271d4b2f000a0f2ea',
'0xebEb87c42C4eA344c1b5493283e610FeE2429292',
'0xA8fba7d3Cbde5Dc8b9F45b493BbC76b95682B027',
'0x42dcc796fF5B5d8D11928448a3eb62127b52BF5D',
'0xb728c346cb6076F28c09724893457EbE9C8BAee3',
'0xF011f357da24cad5Bb0897C2D652225937aBC4D7',
'0x2a34fe43E8aBD22A41971014F3ecAb9BEf6937a3',
'0xf1bF108E81DD7257D491a6cd2575156B8afe25cB',
'0x43Ca5320BAbF6B2f2328a6dE5C1d97C794d41aBd',
'0x61d2B74b491c45bc6C694BA8d5B398e4c55e915F',
'0x469D4107ad071C8C925dd937177D16181f40a957',
'0x3FfA11Acc1B21D44ddc39416f072c57e0b6aC957',
'0x4a07c130C44B90Eb729C752EC44abC11aD5CF54B',
'0xeAE1323B2aCcc6DEE36fAa34e52Ba2faF6D62566',
'0xEdaba5a0FfB676eA196d19aa2A7FfDbAcE629847',
'0x3bc2DB8d5884EE0035fd7B6A86a1be027A3d4871',
'0x7d00F88Da8cB5f098f091FF50621A8C3Adc0B2E9',
'0x891Fc1729F2CDa227F410b9AA75c8368204a01e7',
'0xcA480B1594EaF04D86Db0c7197E346c9DcDCf250',
'0x642A395777E11032F68bF1503100320B09ac5ae7',
'0x7dA576e5AEA2eFF590b0621927B58d6C9d7B8A2c',
'0x88Be8ed5D9d48C6A8024bC4eeB08258edFE42cd9',
'0xeB0E8aeC5De2312788aEb352d3c4Baf105B26E8c',
'0x6e384e2E0be6D3e91BA2f59E5013E16536EADEDF',
'0xa67a78BF7A23c0504441138fa9c64f816F9e1414',
'0xC6b07b5D7693d9a817aDff569514eB784839500A',
'0x3654bE46c941D890505D4d3AF1F13FaE5D805149',
'0x5D9bBa1e515D51C540Ea32A3c0B17eF2A2db1f92',
'0x4529054AB4bA35DA86798c6f499011f93D7c59B3',
'0x6bd22EC59c7956cEA1F316843629Ace709d24A5c',
'0x889b521105BeaF8BF5EcDE387c899aE206C30841',
'0x808985f7a7BB4202EB3c8E37719e8C9B3d36EDe7',
'0x588a2bC34FF05A21f5999F491280C8246D983523',
'0xD95C9cEd01D113B7086d8cf52790e10f01819394',
'0x2c3f71f01276Ed3230D79F9033D4aB73F86Be4E8',
'0x093b5d3cCa250FD85b5f9c7fD7DB8Ff4b0593E2b',
'0x82C46c62538533769642b7E8b9525F7754f6965f',
'0x326475CC33b6B03e71bef82B51586d0fd466cA42',
'0xDC4c7e0c78Db8fb1BeaF0a300d1A04D4B408737e',
'0xCD2e2cAc4961DA4020a346e63b7ccffF25d99791',
'0xE922399AaF629DEA63987F2157b0cA7C44f4De90',
'0xf532651735713E8671FE418124703ab662088C75',
'0x0a09d24551411900b26c2c8354B61Bbc4A3217E3',
'0xBEbC6DfA31673F17C8b0Dd4af43b51eb1930Ce8f',
'0x5E539AA5b452A9e1D4A8Ec562B8CaA6e38234B8F',
'0xb489609C60d9A23eaFf0fF67A2c01487836a8Aac',
'0x03431F92907564f1587f912D93bc05d08156a413',
'0xe86130c4E66EaC98db23b427778cbFe9EEc2D4C6',
'0x4e78385Fe0F3aB6582d8F527b251472684605Ca1',
'0xAdbB5096EF9d2f7307B7CfD3f9CBE9e889Fa6384',
'0x0C439c264D4c66a964AE915B20969411ef22667B',
'0x93953F26C713627B6d6f413954a3994A22b69E4C',
'0x85e0035eDF04cf36f074f5d24625B95C54636bc6',
'0xbB2E93F8F7809ecba24D26317EDa6CF5eBf6db71',
'0xCf79aC2CEfb3Eb3BFd57b8f3d3c1f0cc26bD7034',
'0xd9c045ddb2fec70383AfD550d00695C3168D25A8',
'0x9729C5A53a0514Fd124a74c9fc83Fc2E8b8161FB',
'0x824914a506C5B6690Cb7B822eE46150fB16EE0A8',
'0xcea011EC00536b2CfB486F295497D91294d49cA3',
'0xE9FCAFff808F539A65adA7774cBf3bf54d047980',
'0x293708dDB36C5806956c238d5C662b036C893C8a',
'0x64097B37830C77D453E42102f6178B04C0A39789',
'0xF1C48EA325Dd7329c572131Cf23f339EfD28c2CF',
'0x3CBf2111fC6872f425EdCc0008F2fd488AE687e9',
'0xb8A2AcebA5986a3358Be5C543547ba78B9DeDf15',
'0xA33D40F5710EC860ac9eD6D683Fdc9d464776d97',
'0xF897C272513FB2ABB25f4142796a379A69B28097',
'0xB4127E45C5B4e25EF4dc893047087c051Eb54EEa',
'0x6E01e5e4BAfBb366D7eAeeC5Ade695989AaD7d8d',
'0x6149CD56fDc7100D54B6BbbBFD13919DF72f4061',
'0x96e2CBA9dCC0b61D18D9BA5B387B17111C4F2496',
'0x1270781F79133e7d1EB6928aca40cD949af27dA8',
'0x59ce436890c241Bac964FDEBBcc0c4f1eF0C2deE',
'0x738608063b0664f0A1377F34ebDACBa8AD246a64'
    ];
    const ironNFTs = [
        5,
        5,
        5,
        2,
        1,
        2,
        3,
        3,
        13,
        5,
        1,
        2,
        1,
        2,
        50,
        2,
        10,
        54,
        7,
        5,
        10,
        15,
        5,
        1,
        1,
        10,
        1,
        15,
        5,
        10,
        1,
        20,
        2,
        2,
        2,
        1,
        2,
        1,
        100,
        2,
        1,
        10,
        1,
        2,
        10,
        2,
        2,
        1,
        2,
        1,
        10,
        210,
        4,
        10,
        10,
        10,
        2,
        3,
        9,
        1,
        10,
        3,
        1,
        3,
        130,
        1,
        50,
        1,
        1,
        1,
        4,
        50,
        1,
        1,
        1,
        3,
        2,
        2,
        74,
        10,
        1,
        47,
        2,
        2,
        11,
        1,
        1,
        1,
        10,
        10,
        1,
        1,
        2,
        9,
        2,
        10,
        10,
        1,
        2,
        4,
        3,
        5,
        1,
        1,
        10,
        10,
        1,
        5,
        1,
        10,
        1,
        5,
        10,
        7,
        1,
        2,
        30,
        5,
        3,
        1,
        2,
        2,
        2,
        1,
        2,
        1,
        2,
        1,
        3,
        199,
        4,
        5,
        1,
        24,
        7,
        6,
        3,
        2,
        20,
        1,
        2,
        2,
        10,
        1,
        3864,
        15,
        10,
        2,
        1,
        1,
        20,
        1,
        2,
        1,
        24,
        1,
        1,
        1,
        1,
        1,
        15,
        1,
        225,
        200,
        45,
        1,
        5,
        48,
        1,
        1,
        10,
        1,
        14,
        10,
        1,
        3,
        1,
        1,
        1,
        1,
        1,
        1,
        5,
        1,
        213,
        1,
        2,
        4,
        2,
        50,
        1,
        9,
        1,
        1,
        2,
        3,
        1,
        10,
        2,
        5,
        1,
        1,
        12,
        286,
        50,
        1,
        2,
        183,
        5,
        50,
        1,
        20,
        1,
        6,
        2,
        1,
        55,
        12,
        37,
        3,
        1,
        300,
        152,
        9,
        10,
        3,
        2,
        2,
        1,
        90,
        4,
        188,
        11,
        1,
        2,
        1,
        3,
        2,
        1,
        3,
        1,
        2,
        1,
        15,
        85,
        1,
        27,
        308,
        27,
        27,
        27,
        27,
        27,
        17,
        1,
        1,
        1,
        1,
        3,
        1,
        1,
        1,
        2,
        1,
        150,
        60,
        24,
        10,
        4,
        4,
        2,
        1,
        1,
        1,
        0,
        0,
        0,
        0
    ];
    const nickelNFTs = [
        1,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
5,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
5,
0,
0,
0,
0,
0,
0,
0,
0,
0,
1,
0,
0,
0,
0,
2,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
1,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
1,
0,
0,
0,
0,
0,
0,
0,
1,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
5,
0,
0,
0,
22,
0,
1,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
1,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
1,
1,
1,
1,
1,
1,
1,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
1,
1,
2,
0
    ];
    const cobaltNFTs = [
        1,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
1,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
2,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
1,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
1,
1,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
1,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
1,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
1,
0,
0,
0,
0,
5,
0,
0,
0,
5,
0,
1,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
1,
0,
1,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
1,
1,
1,
1,
1,
1,
1,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
1
    ];
    console.log("Updating recipients...");
    const batchSize = 12;
    for (let i = 0; i < batchSize; i++) {
        await contract.updateRecipients(i,recipientAddresses,ironNFTs,nickelNFTs,cobaltNFTs);
        console.log("Updated Batch Number: ", i);
        await setTimeout(8000);
    }

    console.log("Recipients updated.");
*/


/*
    // Update drip rate
    const newDripRate = 10; // New drip rate
    console.log("Updating drip rate...");
    await contract.updateDripRate(newDripRate);
    console.log("Drip rate updated.");
*/

/*
    // Get deposited tokens
    console.log("Getting deposited tokens...");
    const depositedTokens = await contract.getDepositedTokens();
    console.log("Deposited tokens:", depositedTokens);
*/

/*
    // Get rewards balance for a token
    const tokenAddress = "0xEB039260c317914207B01727de33c27Bd806C6eF"; // Address of the token
    console.log("Getting rewards balance for a token...");
    const [ironRewardBalance, nickelRewardBalance, cobaltRewardBalance] = await contract.getRewardsBalance(tokenAddress);
    console.log("Rewards balance for Iron:", ironRewardBalance);
    console.log("Rewards balance for Nickel:", nickelRewardBalance);
    console.log("Rewards balance for Cobalt:", cobaltRewardBalance);
*/

/*
    // Get amount per Ferro for a token
    console.log("Getting amount per Ferro for a token...");
    const [airdropPerIron, airdropPerNickel, airdropPerCobalt] = await contract.getAmountPerFerro(tokenAddress);
    console.log("Airdrop per Iron:", airdropPerIron);
    console.log("Airdrop per Nickel:", airdropPerNickel);
    console.log("Airdrop per Cobalt:", airdropPerCobalt);
*/

/*
    const newOwner = "0xCa7250117ddA2DD45d9e4DA1bb4Def40fA727dC6";
    await contract.transferOwnership(newOwner);
    console.log("FCRF: transfered owner of contract to:", newOwner);
*/
}    


main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });