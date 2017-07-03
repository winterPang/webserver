;(function($F)
{

$F.arrPortInfo = [
//  layoutType, DislayMsg,                      maxSpeed(M)
    ["SFP",     "Unknown",                      1000],  // 0, No defination in MIB
    ["RJ45",    "10or100M",                     100],   // 1, hh3cevtPortSw-10or100M
    ["SFP",     "1000BaseLxSm",                 1000],  // 2, hh3cevtPortSw-1000BaseLxSm
    ["SFP",     "1000BaseSxMm",                 1000],  // 3, hh3cevtPortSw-1000BaseSxMm
    ["RJ45",    "1000BaseTx",                   1000],  // 4, hh3cevtPortSw-1000BaseTx
    ["SFP",     "100MSinglemodeFx",             100],   // 5, hh3cevtPortSw-100MSinglemodeFx
    ["SFP",     "100MMultimodeFx",              100],   // 6, hh3cevtPortSw-100MMultimodeFx
    ["RJ45",    "100M100BaseTx",                100],   // 7, hh3cevtPortSw-100M100BaseTx
    ["SFP",     "100MHub",                      100],   // 8, hh3cevtPortSw-100MHub
    ["SFP",     "Vdsl",                         1000],  // 9, hh3cevtPortSw-Vdsl
    ["SFP",     "Stack",                        1000],  //10, hh3cevtPortSw-Stack
    ["SFP",     "1000BaseZenithFx",             1000],  //11, hh3cevtPortSw-1000BaseZenithFx
    ["SFP",     "1000BaseLongFx",               1000],  //12, hh3cevtPortSw-1000BaseLongFx
    ["SFP",     "Adsl",                         1000],  //13, hh3cevtPortSw-Adsl
    ["SFP",     "10or100MDb",                   100],   //14, hh3cevtPortSw-10or100MDb
    ["SFP",     "10GBaseLrSm",                  10000], //15, hh3cevtPortSw-10GBaseLrSm
    ["SFP",     "10GBaseLx4Mm",                 10000], //16, hh3cevtPortSw-10GBaseLx4Mm
    ["SFP",     "10GBaseLx4Sm",                 10000], //17, hh3cevtPortSw-10GBaseLx4Sm
    ["SFP",     "100MLongFx",                   100],   //18, hh3cevtPortSw-100MLongFx
    ["SFP",     "1000BaseCx",                   1000],  //19, hh3cevtPortSw-1000BaseCx
    ["SFP",     "1000BaseZenithFxLc",           1000],  //20, hh3cevtPortSw-1000BaseZenithFxLc
    ["SFP",     "1000BaseLongFxLc",             1000],  //21, hh3cevtPortSw-1000BaseLongFxLc
    ["SFP",     "100MSmFxSc",                   100],   //22, hh3cevtPortSw-100MSmFxSc
    ["SFP",     "100MMmFxSc",                   100],   //23, hh3cevtPortSw-100MMmFxSc
    ["SFP",     "100MSmFxLc",                   100],   //24, hh3cevtPortSw-100MSmFxLc
    ["SFP",     "100MMmFxLc",                   100],   //25, hh3cevtPortSw-100MMmFxLc
    ["SFP",     "GbicNoConnector",              1000],  //26, hh3cevtPortSw-GbicNoConnector
    ["RJ45",    "Gbic1000BaseT",                1000],  //27, hh3cevtPortSw-Gbic1000BaseT
    ["SFP",     "Gbic1000BaseLx",               1000],  //28, hh3cevtPortSw-Gbic1000BaseLx
    ["SFP",     "Gbic1000BaseSx",               1000],  //29, hh3cevtPortSw-Gbic1000BaseSx
    ["SFP",     "Gbic1000BaseZx",               1000],  //30, hh3cevtPortSw-Gbic1000BaseZx
    ["SFP",     "ComboNoConnector",             1000],  //31, hh3cevtPortSw-ComboNoConnector
    ["SFP",     "Combo1000BaseLx",              1000],  //32, hh3cevtPortSw-Combo1000BaseLx
    ["SFP",     "Combo1000BaseLxFiber",         1000],  //33, hh3cevtPortSw-Combo1000BaseLxFiber
    ["SFP",     "Combo1000BaseLxCopper",        1000],  //34, hh3cevtPortSw-Combo1000BaseLxCopper
    ["SFP",     "Combo1000BaseSx",              1000],  //35, hh3cevtPortSw-Combo1000BaseSx
    ["SFP",     "Combo1000BaseSxFiber",         1000],  //36, hh3cevtPortSw-Combo1000BaseSxFiber
    ["SFP",     "Combo1000BaseSxCopper",        1000],  //37, hh3cevtPortSw-Combo1000BaseSxCopper
    ["SFP",     "Combo1000BaseZx",              1000],  //38, hh3cevtPortSw-Combo1000BaseZx
    ["SFP",     "Combo1000BaseZxFiber",         1000],  //39, hh3cevtPortSw-Combo1000BaseZxFiber
    ["SFP",     "Combo1000BaseZxCopper",        1000],  //40, hh3cevtPortSw-Combo1000BaseZxCopper
    ["SFP",     "155PosSxMmf",                  155],   //41, hh3cevtPortSw-155PosSxMmf
    ["SFP",     "155PosLxSmf",                  155],   //42, hh3cevtPortSw-155PosLxSmf
    ["RJ45",    "1000BASE-T",                   1000],  //43, hh3cevtPortSw-1000BASE-T
    ["SFP",     "1000BASE-SX-SFP",              1000],  //44, hh3cevtPortSw-1000BASE-SX-SFP
    ["SFP",     "1000BASE-LX-SFP",              1000],  //45, hh3cevtPortSw-1000BASE-LX-SFP
    ["SFP",     "1000BASE-T-AN-SFP",            1000],  //46, hh3cevtPortSw-1000BASE-T-AN-SFP
    ["10G",     "10GBASE-LX4-XENPAK",           10000], //47, hh3cevtPortSw-10GBASE-LX4-XENPAK
    ["10G",     "10GBASE-LR-XENPAK",            10000], //48, hh3cevtPortSw-10GBASE-LR-XENPAK
    ["10G",     "10GBASE-CX4",                  10000], //49, hh3cevtPortSw-10GBASE-CX4
    ["SFP",     "1000BASE-ZX-SFP",              1000],  //50, hh3cevtPortSw-1000BASE-ZX-SFP
    ["SFP",     "1000BASE-MM-SFP",              1000],  //51, hh3cevtPortSw-1000BASE-MM-SFP
    ["SFP",     "100BASE-SX-SFP",               100],   //52, hh3cevtPortSw-100BASE-SX-SFP
    ["SFP",     "100BASE-LX-SFP",               100],   //53, hh3cevtPortSw-100BASE-LX-SFP
    ["SFP",     "100BASE-T-AN-SFP",             100],   //54, hh3cevtPortSw-100BASE-T-AN-SFP
    ["SFP",     "100BASE-ZX-SFP",               100],   //55, hh3cevtPortSw-100BASE-ZX-SFP
    ["SFP",     "100BASE-MM-SFP",               100],   //56, hh3cevtPortSw-100BASE-MM-SFP
    ["SFP",     "SFP-NO-CONNECTOR",             1000],  //57, hh3cevtPortSw-SFP-NO-CONNECTOR
    ["SFP",     "SFP-UNKNOWN-CONNECTOR",        1000],  //58, hh3cevtPortSw-SFP-UNKNOWN-CONNECTOR
    ["SFP",     "POS-NO-CONNECTOR",             1000],  //59: hh3cevtPortSw-POS-NO-CONNECTOR
    ["10G",     "10G-BASE-SR",                  10000], //60: hh3cevtPortSw-10G-BASE-SR
    ["10G",     "10G-BASE-ER",                  10000], //61: hh3cevtPortSw-10G-BASE-ER
    ["10G",     "10G-BASE-LX4",                 10000], //62: hh3cevtPortSw-10G-BASE-LX4
    ["10G",     "10G-BASE-SW",                  10000], //63: hh3cevtPortSw-10G-BASE-SW
    ["10G",     "10G-BASE-LW",                  10000], //64: hh3cevtPortSw-10G-BASE-LW
    ["10G",     "10G-BASE-EW",                  10000], //65: hh3cevtPortSw-10G-BASE-EW
    ["10G",     "10G-LR-SM-LC",                 10000], //66: hh3cevtPortSw-10G-LR-SM-LC
    ["10G",     "10G-SR-MM-LC",                 10000], //67: hh3cevtPortSw-10G-SR-MM-LC
    ["10G",     "10G-ER-SM-LC",                 10000], //68: hh3cevtPortSw-10G-ER-SM-LC
    ["10G",     "10G-LW-SM-LC",                 10000], //69: hh3cevtPortSw-10G-LW-SM-LC
    ["10G",     "10G-SW-MM-LC",                 10000], //70: hh3cevtPortSw-10G-SW-MM-LC
    ["10G",     "10G-EW-SM-LC",                 10000], //71: hh3cevtPortSw-10G-EW-SM-LC
    ["SFP",     "100BASE-SM-MTRJ",              100],   //72: hh3cevtPortSw-100BASE-SM-MTRJ
    ["SFP",     "100BASE-MM-MTRJ",              100],   //73: hh3cevtPortSw-100BASE-MM-MTRJ
    ["10G",     "XFP-NO-CONNECTOR",             10000], //74: hh3cevtPortSw-XFP-NO-CONNECTOR
    ["10G",     "XFP-10GBASE-SR",               10000], //75: hh3cevtPortSw-XFP-10GBASE-SR
    ["10G",     "XFP-10GBASE-LR",               10000], //76: hh3cevtPortSw-XFP-10GBASE-LR
    ["10G",     "XFP-10GBASE-ER",               10000], //77: hh3cevtPortSw-XFP-10GBASE-ER
    ["10G",     "XFP-10GBASE-SW",               10000], //78: hh3cevtPortSw-XFP-10GBASE-SW
    ["10G",     "XFP-10GBASE-LW",               10000], //79: hh3cevtPortSw-XFP-10GBASE-LW
    ["10G",     "XFP-10GBASE-EW",               10000], //80: hh3cevtPortSw-XFP-10GBASE-EW
    ["10G",     "XFP-10GBASE-CX4",              10000], //81: hh3cevtPortSw-XFP-10GBASE-CX4
    ["10G",     "XFP-10GBASE-LX4",              10000], //82: hh3cevtPortSw-XFP-10GBASE-LX4
    ["SFP",     "XFP-UNKNOWN",                  1000],  //83: hh3cevtPortSw-XFP-UNKNOWN
    ["SFP",     "XPK-NOCONNECTOR",              1000],  //84: hh3cevtPortSw-XPK-NOCONNECTOR
    ["10G",     "XPK-10GBASE-SR",               10000], //85: hh3cevtPortSw-XPK-10GBASE-SR
    ["10G",     "XPK-10GBASE-LR",               10000], //86: hh3cevtPortSw-XPK-10GBASE-LR
    ["10G",     "XPK-10GBASE-ER",               10000], //87: hh3cevtPortSw-XPK-10GBASE-ER
    ["10G",     "XPK-10GBASE-SW",               10000], //88: hh3cevtPortSw-XPK-10GBASE-SW
    ["10G",     "XPK-10GBASE-LW",               10000], //89: hh3cevtPortSw-XPK-10GBASE-LW
    ["10G",     "XPK-10GBASE-EW",               10000], //90: hh3cevtPortSw-XPK-10GBASE-EW
    ["10G",     "XPK-10GBASE-CX4",              10000], //91: hh3cevtPortSw-XPK-10GBASE-CX4
    ["10G",     "XPK-10GBASE-LX4",              10000], //92: hh3cevtPortSw-XPK-10GBASE-LX4
    ["SFP",     "XPK-UNKNOWN",                  1000],  //93: hh3cevtPortSw-XPK-UNKNOWN
    ["SFP",     "POS-OC48-SR-SM-LC",            1000],  //94: hh3cevtPortSw-POS-OC48-SR-SM-LC 
    ["SFP",     "POS-OC48-IR-SM-LC",            1000],  //95: hh3cevtPortSw-POS-OC48-IR-SM-LC
    ["SFP",     "POS-OC48-LR-SM-LC",            1000],  //96: hh3cevtPortSw-POS-OC48-LR-SM-LC
    ["10G",     "10G-BASE-CX4",                 10000], //97: hh3cevtPortSw-10G-BASE-CX4
    ["SFP",     "OLT-1000BASE-BX-SFF-SC",       1000],  //98: hh3cevtPortSw-OLT-1000BASE-BX-SFF-SC
    ["SFP",     "ONU-1000BASE-BX-SFF-SC",       1000],  //99: hh3cevtPortSw-ONU-1000BASE-BX-SFF-SC
    ["STACK",   "24G-CASCADE",                  24000], //100: hh3cevtPortSw-24G-CASCADE
    ["SFP",     "POS-OC3-SR-MM",                1000],  //101, hh3cevtPortSw-POS-OC3-SR-MM
    ["SFP",     "POS-OC3-IR-SM",                1000],  //102, hh3cevtPortSw-POS-OC3-IR-SM
    ["SFP",     "POS-OC3-IR-1-SM",              1000],  //103, hh3cevtPortSw-POS-OC3-IR-1-SM
    ["SFP",     "POS-OC3-IR-2-SM",              1000],  //104, hh3cevtPortSw-POS-OC3-IR-2-SM
    ["SFP",     "POS-OC3-LR-SM",                1000],  //105, hh3cevtPortSw-POS-OC3-LR-SM
    ["SFP",     "POS-OC3-LR-1-SM",              1000],  //106, hh3cevtPortSw-POS-OC3-LR-1-SM
    ["SFP",     "POS-OC3-LR-2-SM",              1000],  //107, hh3cevtPortSw-POS-OC3-LR-2-SM
    ["SFP",     "POS-OC3-LR-3-SM",              1000],  //108, hh3cevtPortSw-POS-OC3-LR-3-SM
    ["SFP",     "POS-OC12-SR-MM",               1000],  //109, hh3cevtPortSw-POS-OC12-SR-MM
    ["SFP",     "POS-OC12-IR-SM",               1000],  //110, hh3cevtPortSw-POS-OC12-IR-SM
    ["SFP",     "POS-OC12-IR-1-SM",             1000],  //111, hh3cevtPortSw-POS-OC12-IR-1-SM
    ["SFP",     "POS-OC12-IR-2-SM",             1000],  //112, hh3cevtPortSw-POS-OC12-IR-2-SM
    ["SFP",     "POS-OC12-LR-SM",               1000],  //113, hh3cevtPortSw-POS-OC12-LR-SM
    ["SFP",     "POS-OC12-LR-1-SM",             1000],  //114, hh3cevtPortSw-POS-OC12-LR-1-SM
    ["SFP",     "POS-OC12-LR-2-SM",             1000],  //115, hh3cevtPortSw-POS-OC12-LR-2-SM
    ["SFP",     "POS-OC12-LR-3-SM",             1000],  //116, hh3cevtPortSw-POS-OC12-LR-3-SM
    ["SFP",     "POS-OC48-SR-SM",               1000],  //117, hh3cevtPortSw-POS-OC48-SR-SM
    ["SFP",     "POS-OC48-IR-SM",               1000],  //118, hh3cevtPortSw-POS-OC48-IR-SM
    ["SFP",     "POS-OC48-IR-1-SM",             1000],  //119, hh3cevtPortSw-POS-OC48-IR-1-SM
    ["SFP",     "POS-OC48-IR-2-SM",             1000],  //120, hh3cevtPortSw-POS-OC48-IR-2-SM
    ["SFP",     "POS-OC48-LR-SM",               1000],  //121, hh3cevtPortSw-POS-OC48-LR-SM
    ["SFP",     "POS-OC48-LR-1-SM",             1000],  //122, hh3cevtPortSw-POS-OC48-LR-1-SM
    ["SFP",     "POS-OC48-LR-2-SM",             1000],  //123, hh3cevtPortSw-POS-OC48-LR-2-SM
    ["SFP",     "POS-OC48-LR-3-SM",             1000],  //124, hh3cevtPortSw-POS-OC48-LR-3-SM
    ["SFP",     "POS-I-64-1",                   1000],  //125, hh3cevtPortSw-POS-I-64-1
    ["SFP",     "POS-I-64-2",                   1000],  //126, hh3cevtPortSw-POS-I-64-2
    ["SFP",     "POS-I-64-3",                   1000],  //127, hh3cevtPortSw-POS-I-64-3
    ["SFP",     "POS-I-64-5",                   1000],  //128, hh3cevtPortSw-POS-I-64-5
    ["SFP",     "POS-S-64-1",                   1000],  //129, hh3cevtPortSw-POS-S-64-1
    ["SFP",     "POS-S-64-2",                   1000],  //130, hh3cevtPortSw-POS-S-64-2
    ["SFP",     "POS-S-64-3",                   1000],  //131, hh3cevtPortSw-POS-S-64-3
    ["SFP",     "POS-S-64-5",                   1000],  //132, hh3cevtPortSw-POS-S-64-5
    ["SFP",     "POS-L-64-1",                   1000],  //133, hh3cevtPortSw-POS-L-64-1
    ["SFP",     "POS-L-64-2",                   1000],  //134, hh3cevtPortSw-POS-L-64-2
    ["SFP",     "POS-L-64-3",                   1000],  //135, hh3cevtPortSw-POS-L-64-3
    ["SFP",     "POS-V-64-2",                   1000],  //136, hh3cevtPortSw-POS-V-64-2
    ["SFP",     "POS-V-64-3",                   1000],  //137, hh3cevtPortSw-POS-V-64-3
    ["SFP",     "100BASE-FX-BIDI",              100],   //138, hh3cevtPortSw-100BASE-FX-BIDI
    ["SFP",     "100BASE-BX10-U-SFP",           100],   //139, hh3cevtPortSw-100BASE-BX10-U-SFP
    ["SFP",     "100BASE-BX10-D-SFP",           100],   //140, hh3cevtPortSw-100BASE-BX10-D-SFP
    ["SFP",     "1000BASE-BX10-U-SFP",          1000],  //141, hh3cevtPortSw-1000BASE-BX10-U-SFP
    ["SFP",     "1000BASE-BX10-D-SFP",          1000],  //142, hh3cevtPortSw-1000BASE-BX10-D-SFP
    ["SFP",     "STK-1000BASE-T",               1000],  //143, hh3cevtPortSw-STK-1000BASE-T
    ["SFP",     "RPR-PHYPOS-CONNECTOR",         1000],  //144, hh3cevtPortSw-RPR-PHYPOS-CONNECTOR
    ["SFP",     "RPR-PHY10GE-CONNECTOR",        10000], //145, hh3cevtPortSw-RPR-PHY10GE-CONNECTOR
    ["SFP",     "RPR-LOGICPOS-CONNECTOR",       1000],  //146, hh3cevtPortSw-RPR-LOGICPOS-CONNECTOR
    ["SFP",     "RPR-LOGIC10GE-CONNECTOR",      10000], //147, hh3cevtPortSw-RPR-LOGIC10GE-CONNECTOR
    ["SFP",     "10GBASE-ZR",                   10000], //148, hh3cevtPortSw-10GBASE-ZR
    ["SFP",     "TYPE-ERROR-CONNECTOR",         1000],  //149, hh3cevtPortSw-TYPE-ERROR-CONNECTOR
    ["SFP",     "10G-STACK",                    10000], //150, hh3cevtPortSw-10G-STACK
    ["SFP",     "155-ATM-SX-MMF",               155],   //151, hh3cevtPortSw-155-ATM-SX-MMF
    ["SFP",     "155-ATM-LX-SMF",               155],   //152, hh3cevtPortSw-155-ATM-LX-SMF
    ["SFP",     "622-ATM-SX-MMF",               622],   //153, hh3cevtPortSw-622-ATM-SX-MMF
    ["SFP",     "622-ATM-LX-SMF",               622],   //154, hh3cevtPortSw-622-ATM-LX-SMF
    ["SFP",     "155-ATM-NO-CONNECTOR",         155],   //155, hh3cevtPortSw-155-ATM-NO-CONNECTOR
    ["SFP",     "622-ATM-NO-CONNECTOR",         622],   //156, hh3cevtPortSw-622-ATM-NO-CONNECTOR
    ["SFP",     "155-CPOS-E1-NO-CONNECTOR",     155],   //157, hh3cevtPortSw-155-CPOS-E1-NO-CONNECTOR
    ["SFP",     "155-CPOS-T1-NO-CONNECTOR",     155],   //158, hh3cevtPortSw-155-CPOS-T1-NO-CONNECTOR
    ["SFP",     "622-CPOS-E1-NO-CONNECTOR",     622],   //159, hh3cevtPortSw-622-CPOS-E1-NO-CONNECTOR
    ["SFP",     "622-CPOS-T1-NO-CONNECTOR",     622],   //160, hh3cevtPortSw-622-CPOS-T1-NO-CONNECTOR
    ["SFP",     "155-CPOS-E1-SX-MMF",           155],   //161, hh3cevtPortSw-155-CPOS-E1-SX-MMF
    ["SFP",     "155-CPOS-T1-SX-MMF",           155],   //162, hh3cevtPortSw-155-CPOS-T1-SX-MMF
    ["SFP",     "155-CPOS-E1-LX-SMF",           155],   //163, hh3cevtPortSw-155-CPOS-E1-LX-SMF
    ["SFP",     "155-CPOS-T1-LX-SMF",           155],   //164, hh3cevtPortSw-155-CPOS-T1-LX-SMF
    ["SFP",     "622-CPOS-E1-SX-MMF",           622],   //165, hh3cevtPortSw-622-CPOS-E1-SX-MMF
    ["SFP",     "622-CPOS-T1-SX-MMF",           622],   //166, hh3cevtPortSw-622-CPOS-T1-SX-MMF
    ["SFP",     "622-CPOS-E1-LX-SMF",           622],   //167, hh3cevtPortSw-622-CPOS-E1-LX-SMF
    ["SFP",     "622-CPOS-T1-LX-SMF",           622],   //168, hh3cevtPortSw-622-CPOS-T1-LX-SMF
    ["SFP",     "E1-CONNECTOR",                 1000],  //169, hh3cevtPortSw-E1-CONNECTOR
    ["SFP",     "T1-CONNECTOR",                 1000],  //170, hh3cevtPortSw-T1-CONNECTOR
    ["SFP",     "1000BASE-STK-SFP",             1000],  //171, hh3cevtPortSw-1000BASE-STK-SFP
    ["SFP",     "1000BASE-BIDI-SFP",            1000],  //172, hh3cevtPortSw-1000BASE-BIDI-SFP
    ["SFP",     "1000BASE-CWDM-SFP",            1000],  //173, hh3cevtPortSw-1000BASE-CWDM-SFP
    ["SFP",     "100BASE-BIDI-SFP",             100],   //174, hh3cevtPortSw-100BASE-BIDI-SFP
    ["SFP",     "OLT-1000BASE-PX-SFP",          1000],  //175, hh3cevtPortSw-OLT-1000BASE-PX-SFP
    ["SFP",     "OLT-1000BASE-NO-CONNECTOR",    1000],  //176, hh3cevtPortSw-OLT-1000BASE-NO-CONNECTOR
    ["SFP",     "RPR-PHYGE-CONNECTOR",          1000],  //177, hh3cevtPortSw-RPR-PHYGE-CONNECTOR
    ["SFP",     "RPR-LOGICGE-CONNECTOR",        1000],  //178, hh3cevtPortSw-RPR-LOGICGE-CONNECTOR
    ["SFP",     "100M-1550-BIDI",               100],   //179, hh3cevtPortSw-100M-1550-BIDI
    ["SFP",     "100M-1310-BIDI",                100],   //180, hh3cevtPortSw-100M-1310-BIDI
    ["SFP",     "RPR-PHYOC48-CONNECTOR",        1000],  //181, hh3cevtPortSw-RPR-PHYOC48-CONNECTOR
    ["SFP",     "RPR-LOGICOC48-CONNECTOR",      1000],  //182, hh3cevtPortSw-RPR-LOGICOC48-CONNECTOR
    ["SFP",     "100-1000-BASE-LX-SMF",         1000],  //183, hh3cevtPortSw-100-1000-BASE-LX-SMF
    ["10G",     "10G-ZW-SM-LC",                 10000], //184, hh3cevtPortSw-10G-ZW-SM-LC
    ["10G",     "10G-ZR-SM-LC",                 10000], //185, hh3cevtPortSw-10G-ZR-SM-LC
    ["10G",     "XPK-10GBASE-ZR",               10000], //186, hh3cevtPortSw-XPK-10GBASE-ZR 
    ["SFP",     "SGMII-100-BASE-LX-SFP",        100],   //187, hh3cevtPortSw-SGMII-100-BASE-LX-SFP
    ["SFP",     "SGMII-100-BASE-FX-SFP",        100],   //188, hh3cevtPortSw-SGMII-100-BASE-FX-SFP
    ["SFP",     "WLAN-RADIO",                   1000],  //189, hh3cevtPortSw-WLAN-RADIO
    ["SFP",     "CABLE",                        1000],  //190, hh3cevtPortSw-CABLE
    ["SFP",     "SFP-PLUS-NO-CONNECTOR",        10000], //191, hh3cevtPortSw-SFP-PLUS-NO-CONNECTOR
    ["SFP",     "SFP-PLUS-10GBASE-SR",          10000], //192, hh3cevtPortSw-SFP-PLUS-10GBASE-SR
    ["SFP",     "SFP-PLUS-10GBASE-LR",          10000], //193, hh3cevtPortSw-SFP-PLUS-10GBASE-LR
    ["SFP",     "SFP-PLUS-10GBASE-LRM",         10000], //194, hh3cevtPortSw-SFP-PLUS-10GBASE-LRM
    ["SFP",     "SFP-PLUS-10GBASE-Cu",          10000], //195, hh3cevtPortSw-SFP-PLUS-10GBASE-Cu
    ["SFP",     "SFP-PLUS-UNKNOWN",             10000], //196, hh3cevtPortSw-SFP-PLUS-UNKNOWN
    ["SFP",     "SFP-PLUS-10GBASE-STACK",       10000], //197, hh3cevtPortSw-SFP-PLUS-STACK-CONNECTOR
    ["SFP",     "POS-L-64-4", 	                10000],  //198, type_POS-L-64-4
    ["SFP",     "MINISAS-HD-STACK-CONNECTOR",   10000],  //199, type_MINISAS-HD-STACK-CONNECTOR
    ["SFP",     "ONU-1000BASE-PX-SFF", 	        10000],  //200, type_ONU-1000BASE-PX-SFF
    ["SFP",     "RS485", 	                    10000],  //201, type_RS485        
    ["SFP",     "SFP-PLUS-10GBASE-ER", 	        10000],  //202, type_SFP-PLUS-10GBASE-ER
    ["SFP",     "SFP-PLUS-10GBASE-ZR", 	        10000],  //203, type_SFP-PLUS-10GBASE-ZR
    ["10G",     "XFP-10GBASE-ZR",               10000],  //204, type_XFP-10GBASE-ZR
    ["SFP",     "QSFP-40GBASE-SR4",             40000],  //205, type_QSFP-40GBASE-SR4
    ["10G",     "QSFP-COPPER-CABLE",            40000],  //206, type_QSFP-COPPER-CABLE
    ["10G",     "QSFP-TO-4SFP-PLUS-CABLE",      10000],  //207, type_QSFP-TO-4SFP-PLUS-CABLE
    ["SFP",     "SFP-STACK-CONNECTOR",           2500],  //208, type_SFP-STACK-CONNECTOR
    ["SFP",     "SFP-STACK-CONNECTOR",           2500],  //209, type_SFP-STACK-CONNECTOR
    ["RJ45",     "SFP-STACK-CONNECTOR",           2500],  //210, type_SFP-STACK-CONNECTOR
    ["SFP",     "SFP-STACK-CONNECTOR",           2500],  //211, type_SFP-STACK-CONNECTOR
    ["SFP",     "SFP-STACK-CONNECTOR",           2500],  //212, type_SFP-STACK-CONNECTOR
    ["SFP",     "SFP-STACK-CONNECTOR",           2500],  //213, type_SFP-STACK-CONNECTOR
    ["SFP",     "SFP-STACK-CONNECTOR",           2500],  //214, type_SFP-STACK-CONNECTOR
    ["SFP",     "SFP-STACK-CONNECTOR",           2500],  //215, type_SFP-STACK-CONNECTOR
    ["SFP",     "SFP-STACK-CONNECTOR",           2500],  //216, type_SFP-STACK-CONNECTOR
    ["SFP",     "SFP-STACK-CONNECTOR",           2500],  //217, type_SFP-STACK-CONNECTOR
    ["SFP",     "SFP-STACK-CONNECTOR",           2500],  //218, type_SFP-STACK-CONNECTOR
    ["SFP",     "SFP-STACK-CONNECTOR",           2500],  //219, type_SFP-STACK-CONNECTOR
    ["RJ45",    "SFP-STACK-CONNECTOR",           2500],  //220, type_SFP-STACK-CONNECTOR
    ["SFP",     "QSFP-PLUS-UNKNOWN",             10000], //221,type_hh3cevtPortSw-QSFP-PLUS-UNKNOWN
    ["SFP",     "CFP-UNKNOWN",                   10000], //222,type_hh3cevtPortSw-CFP-UNKNOWN
    ["SFP",     "QSFP-PLUS-40GBASE-CSR4",        40000], //223,type_hh3cevtPortSw-QSFP-PLUS-40GBASE-CSR4
    ["SFP",     "CFP-40GBASE-ER4",               40000], //224,type_hh3cevtPortSw-CFP-40GBASE-ER4
    ["SFP",     "SFP-1000BASE-BIDI",             1000],  //225,type_hh3cevtPortSw-SFP-1000BASE-BIDI
    ["SFP",     "SFP-PLUS-10GBASE-ZR-DWDM",      10000], //226,type_hh3cevtPortSw-SFP-PLUS-10GBASE-ZR-DWDM
    ["SFP",     "QSFP-PLUS-40GBASE-PSM",         40000], //227,type_hh3cevtPortSw-QSFP-PLUS-40GBASE-PSM
    ["SFP",     "SFP-8GFC-SW",                   1000],  //228,type_hh3cevtPortSw-SFP-8GFC-SW
    ["SFP",     "SFP-8GFC-LW",                   1000],  //229,type_hh3cevtPortSw-SFP-8GFC-LW
    ["SFP",     "CXP-100GBASE-AOC",              10000], //230,type_hh3cevtPortSw-CXP-100GBASE-AOC
    ["SFP",     "QSFP-PLUS-ACTIVE-STACK-CONNECTOR",              10000], //231,type_hh3cevtPortSw-QSFP-PLUS-ACTIVE-STACK-CONNECTOR
    ["SFP",     "QSFP-PLUS-TO-4SFP-PLUS-ACTIVE-STACK-CONNECTOR", 10000], //232,type_hh3cevtPortSw-QSFP-PLUS-TO-4SFP-PLUS-ACTIVE-STACK-CONNECTOR
    ["SFP",     "Invalid",                      1000]   //last: Default
];

})(Frame);
