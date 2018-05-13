<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet xmlns:x="http://www.w3.org/2001/XMLSchema" xmlns:dsp="http://schemas.microsoft.com/sharepoint/dsp" version="1.0" exclude-result-prefixes="xsl msxsl ddwrt x dsp asp __designer SharePoint ddwrt2" xmlns:ddwrt="http://schemas.microsoft.com/WebParts/v2/DataView/runtime" xmlns:asp="http://schemas.microsoft.com/ASPNET/20" xmlns:__designer="http://schemas.microsoft.com/WebParts/v2/DataView/designer" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:SharePoint="Microsoft.SharePoint.WebControls" xmlns:ddwrt2="urn:frontpage:internal">
  <xsl:output method="html" indent="no"/>
  <xsl:param name="RegSearchInitString" select="'[]'"/>
  <xsl:param name="RegSearchResultsPage" select="'.'"/>
  
  
  <xsl:template match="/">
    
    <link rel="stylesheet" type="text/css" href="/sites/Imaging/Style%20Library/RegalNetBranding/Scripts/Libraries/jQuery/UI/smoothness/css/smoothness/jquery-ui-1.10.4.custom.min.css"/>
    <script type="text/javascript" src="/dept/risk/Style%20Library/RegalNetBranding/Scripts/Libraries/jQuery/jquery-1.7.2.min.js"></script>
    <script type="text/javascript" src="/dept/risk/Style%20Library/RegalNetBranding/Scripts/Libraries/jQuery/UI/jquery-ui-1.11.4.custom/jquery-ui.min.js"></script>
    <script type="text/javascript" src="/dept/risk/Style Library/RegalNetBranding/Scripts/Reg.WebControls.Search.js"></script>
    <script type="text/javascript" src="/dept/risk/Style Library/RegalNetBranding/Scripts/Reg.Search.js"></script>

    <script type="text/javascript">
      
      var RegSearchResultsPage = "<xsl:value-of select="$RegSearchResultsPage"/>";
      var RegSearchInitString = "<xsl:value-of select="$RegSearchInitString"/>";
            
      $(document).ready(function () {
        RegSearch.init('pnlSearchControls');
      });
      
    </script>

    <style type="text/css">
      
      #pnlSearch {
        border:1px solid #8599A9;
        padding:10px;
        color:#000000;
      }
      
      #pnlSearchControls {
        padding:3px;
      }
      
      .searchControlTable {
        width:100%;
      }
      
      .keyword {
        width:100%
      }
      
      .boolLabel {
        text-align:center;
        padding-left:10px;
      }
      
      #btnSearch, #btnClear{
        border:1px solid #CCCCCC;
        -webkit-box-shadow: #FEFFFF 0px 1px 1px ;
        -moz-box-shadow: #FEFFFF 0px 1px 1px ; 
        box-shadow: #FEFFFF 0px 1px 1px ; 
        -webkit-border-radius: 3px; 
        -moz-border-radius: 3px;
        border-radius: 3px;
        font-size:12px;
        font-family:arial, helvetica, sans-serif; 
        <!--padding: 10px 10px 10px 10px;--> 
        text-decoration:none; 
        display:inline-block;
        <!--text-shadow: 0px 1px 0 rgba(255,255,255,1);-->
        <!--font-weight:bold;--> 
        color: #4A4A4A;
        background-color: #FFFFFF; background-image: -webkit-gradient(linear, left top, left bottom, from(#FFFFFF), to(#DDDDDD));
        background-image: -webkit-linear-gradient(top, #FFFFFF, #DDDDDD);
        background-image: -moz-linear-gradient(top, #FFFFFF, #DDDDDD);
        background-image: -ms-linear-gradient(top, #FFFFFF, #DDDDDD);
        background-image: -o-linear-gradient(top, #FFFFFF, #DDDDDD);
        background-image: linear-gradient(to bottom, #FFFFFF, #DDDDDD);filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#FFFFFF, endColorstr=#DDDDDD);
        margin-right:5px;
        width:100px;
        height:23px;
      }
      
      #btnSearch:hover, #btnClear:hover{
        background-color: #FFFFFF; background-image: -webkit-gradient(linear, left top, left bottom, from(#FFFFFF), to(#A4C8E5));
        background-image: -webkit-linear-gradient(top, #FFFFFF, #A4C8E5);
        background-image: -moz-linear-gradient(top, #FFFFFF, #A4C8E5);
        background-image: -ms-linear-gradient(top, #FFFFFF, #A4C8E5);
        background-image: -o-linear-gradient(top, #FFFFFF, #A4C8E5);
        background-image: linear-gradient(to bottom, #FFFFFF, #A4C8E5);filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#FFFFFF, endColorstr=#A4C8E5);
      }
      
      
      .searchControl {
        width:100%;
        display:block;
        margin:2px;
      }
      
      .searchControlTextField {
        
      }
      
      .searchControlSelectField {
        
      }
      
      .searchControlDaterangeField {
        width: 100%;
      }
      
      .searchControlDaterangeField INPUT {
        width:80%;
      }
      
      #txtKeyword {
        width:100%;
        border: 1px solid #676767;
      }
      
      .keywordBackground {
        background: url('/sites/Imaging/Style%20Library/RegalNetBranding/Images/Keywords.PNG') no-repeat;
      }
      
      .searchControlDateText {
        vertical-align:middle;
        margin-right:2px;
      }
      
      .ui-datepicker-trigger {
        vertical-align:middle;
      }
    </style>
    
    <xsl:call-template name="Body"/>
    <!--
    FEED DEBUG to show original XML
    <br/>
    <br/>
    <textarea cols="80" rows="20">
      <xsl:apply-templates select="@* | node()"/>
    </textarea>-->
  </xsl:template>

  <xsl:template name="Body">
    <div id="pnlSearch">
      <table style="width:100%;">
        <tr>
          <td>
            <input type="text" id="txtKeyword" class="keyword keywordBackground" />
          </td>
          <td width="80px">
            <input type="radio" name="rdoKeywordBool" value="And" checked="checked" />
            <label>And</label>
            <input type="radio" name="rdoKeywordBool" value="Or" />
            <label>Or</label>
          </td>
        </tr>
      </table>
      <div id="pnlSearchControls"></div>
      <div id="lblOutput"></div>
      <button id="btnSearch">Search</button>
      <button id="btnClear">Clear</button>
    </div>

  </xsl:template>
  
  <xsl:template match="@* | node()">
    <xsl:copy>
      <xsl:apply-templates select="@* | node()"/>
    </xsl:copy>
  </xsl:template>
</xsl:stylesheet>
