<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:dsp="http://schemas.microsoft.com/sharepoint/dsp"
                version="1.0"
                exclude-result-prefixes="xsl msxsl ddwrt"
                xmlns:ddwrt="http://schemas.microsoft.com/WebParts/v2/DataView/runtime"
                xmlns:asp="http://schemas.microsoft.com/ASPNET/20"
                xmlns:__designer="http://schemas.microsoft.com/WebParts/v2/DataView/designer"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:msxsl="urn:schemas-microsoft-com:xslt"
                xmlns:SharePoint="Microsoft.SharePoint.WebControls"
                xmlns:ddwrt2="urn:frontpage:internal"
                xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" 
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:diffgr="urn:schemas-microsoft-com:xml-diffgram-v1"
                xmlns:msprop="urn:schemas-microsoft-com:xml-msprop">
  <xsl:output method="html" indent="no" />

  <xsl:param name="DisplayFields" select="''" />
  <xsl:param name="DisplayNames" select="''" />
  <xsl:param name="OtherFields" select="''" />
  <xsl:param name="Clause" select="''" />
  <xsl:param name="DisplayTypes" select="''" />
  <xsl:param name="OtherCriteria" select="''" />
  <xsl:param name="Scope" select="''" />
  <xsl:param name="SortColumn" select="''"/>
  <xsl:param name="SortDirection" select="''"/>
  <xsl:param name="SiteURL" select="''" />
  <xsl:param name="LimitRows" select="''" />
  <xsl:param name="StartAt" select="''" />
  <xsl:param name="CurrentURL" select="''" />
  <xsl:variable name="rdata" select="/soap:Envelope/soap:Body/*/*" />

  <xsl:variable name="Results" select="$rdata/diffgr:diffgram/Results/RelevantResults"/>
  <xsl:variable name="RowCount" select="count($Results)"/>
  <xsl:variable name="MatchingResults" select="$rdata/xs:schema/xs:element/xs:complexType/xs:choice/xs:element/@msprop:TotalRows" />
  <xsl:variable name="Columns" select="$rdata/xs:schema/xs:element/xs:complexType/xs:choice/xs:element/xs:complexType/xs:sequence/xs:element"/>

  <xsl:variable name="DisplayFieldsXML">
    <xsl:call-template name="DelimToXML">
      <xsl:with-param name="list">
        <xsl:call-template name="toUppercase">
           <xsl:with-param name="text" select="$DisplayFields"/>
        </xsl:call-template>
      </xsl:with-param>
    </xsl:call-template>
  </xsl:variable>

  <xsl:variable name="CurrentPage" select="floor($StartAt div $LimitRows) + 1"/>

  <xsl:variable name="TotalPages" select="floor($MatchingResults div $LimitRows) + 1" />

  <xsl:variable name="DisplayFieldsNodes" select="msxsl:node-set($DisplayFieldsXML)/item" />
  
    <xsl:variable name="DisplayNamesXML">
    <xsl:call-template name="DelimToXML">
      <xsl:with-param name="list" select="$DisplayNames"/>
    </xsl:call-template>
  </xsl:variable>

  <xsl:variable name="DisplayNamesNodes" select="msxsl:node-set($DisplayNamesXML)/item" />
  
  <xsl:variable name="DisplayTypesXML">
    <xsl:call-template name="DelimToXML">
      <xsl:with-param name="list" select="$DisplayTypes"/>
    </xsl:call-template>
  </xsl:variable>

  <xsl:variable name="DisplayTypesNodes" select="msxsl:node-set($DisplayTypesXML)/item" />
  
  <xsl:template match="/">
    <link rel="stylesheet" href="/dept/risk/Style%20Library/RegalNetBranding/Styles/SearchResults.css" />
    <script type="text/javascript" src="/dept/risk/Style%20Library/RegalNetBranding/Scripts/Reg.SearchResults.js"></script>
    
    <!--<script type="text/javascript" src="/sites/Imaging/Style%20Library/RegalNetBranding/Scripts/Libraries/jQuery/jquery-1.9.1.min.js"></script>-->

      
    <!--
    DEBUG INFO: <br />
    DisplayFields : '<xsl:value-of select="$DisplayFields"/>'<br/>
    Columns: <xsl:value-of select="$Columns" /> <br/>
    DisplayFIeldsNodes: <xsl:value-of select="$DisplayFieldsNodes" /> <br/>
    OtherFields : <xsl:value-of select="$OtherFields"/><br/>
    Clause : <xsl:value-of select="$Clause"/><br/>
    OtherCriteria : <xsl:value-of select="$OtherCriteria"/><br/>
    Scope : <xsl:value-of select="$Scope"/><br/>
    SortColumn : <xsl:value-of select="$SortColumn"/><br/>
    SortDirection : <xsl:value-of select="$SortDirection"/><br/>
    LimitRows : <xsl:value-of select="$LimitRows"/><br/>
    StartAt : <xsl:value-of select="$StartAt"/><br/>
    MatchingResults: '<xsl:value-of select="$MatchingResults"/>'<br/>
    RowCount: '<xsl:value-of select="$RowCount"/>'<br/>
    mathTest: <xsl:value-of select="4 + 5"/> <br />
    siteURL: <xsl:value-of select="$SiteURL"/> <br />
    CurrentPage: <xsl:value-of select="$CurrentPage"/> <br />
    TotalPages: <xsl:value-of select="$TotalPages"/> <br />
     -->
    
    
    <xsl:call-template name='Body'/>
    
    <!--
    FEED DEBUG to show original XML
    <br/>
    <br/>
    <textarea cols="80" rows="20">
      <xsl:apply-templates select="@* | node()"/>
    </textarea>-->
    
  </xsl:template>

  <xsl:template name="Body">
    <input type="hidden" name="sort_column" value="{$SortColumn}"/>
    <input type="hidden" name="sort_direction" value="{$SortDirection}" />
    <input type="hidden" name="startAt" value="{$StartAt}" />
    <input type="hidden" name="itemLimit" value="{$LimitRows}" />
    
    <ul id='custom-context-menu'>
      <!-- List items dynamically created here -->
    </ul>
      
    <div id="resultsTable">
      <xsl:variable name="displayMatchingResults">
        <xsl:choose>
          <xsl:when test="$StartAt + $LimitRows - 1&gt;$MatchingResults">
            <xsl:value-of select="$MatchingResults"/>
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="$StartAt + $LimitRows - 1"/>
          </xsl:otherwise>
        </xsl:choose> 
      </xsl:variable>
      <h2 class="searchResultsTitle">
        <xsl:value-of select="concat('Search Results (Items ',$StartAt, ' to ', $displayMatchingResults, ' of ',$MatchingResults, ')')"/>
      </h2>
      <table id="searchResultsTable" class="resultsTable">
        <tr>
          <th></th>
          <xsl:for-each select="$DisplayFieldsNodes">
            <xsl:variable name="headerPosition" select="position()"/>
            <xsl:variable name="headerDisplayName" select="$DisplayNamesNodes[position()=$headerPosition]" />
            
            <th>

              <a class="sortable" data-colname="{.}" href="#" title="Sort" alt="Sort">
                <xsl:value-of select="$headerDisplayName"/>
                <span class="arrow" id="arrow_{.}"> </span>
              </a>
            </th>
          </xsl:for-each>
        </tr>
        <xsl:for-each select="$Results">
          <tr class="searchResultsRow">
            <td>
                <xsl:variable name="fileExtension">
                  <xsl:call-template name="toLowercase">
                    <xsl:with-param name="text" select="substring(./PATH,string-length(./PATH)-2,3)" />
                  </xsl:call-template>
                  
                </xsl:variable>
                <a href="{./PATH}" title="{./TITLE}">
                   <img src="/_layouts/images/{ddwrt:MapToIcon('', $fileExtension)}" style="display: inline; margin-left: auto; margin-right: auto; border:none;"/>
                </a>
                &#160;
                <!--<a onclick="ShowPopupDialog(GetGotoLinkUrl(this));return false;" title="Properties for {./TITLE}">-->
                <a class="itemMenu" data-test2="test2" data-test3="test3">
                  <xsl:attribute name="href">#</xsl:attribute>
                  <xsl:attribute name="data-url">
                    <xsl:value-of select="./PATH"/>
                  </xsl:attribute>
                  <xsl:attribute name="data-properties">
                    <xsl:call-template name="getPropertiesURL">
                      <xsl:with-param name="siteURL" select="$SiteURL" />
                      <xsl:with-param name="fileURL" select="./PATH" />
                      <xsl:with-param name="listItemId" select="./OWSID" />
                      <xsl:with-param name="action" select="'properties'" />
                     </xsl:call-template>
                  </xsl:attribute>
                  <xsl:attribute name="data-web">
                    <xsl:value-of select="$SiteURL"/>
                  </xsl:attribute>
                  <xsl:attribute name="data-edit">
                    <xsl:call-template name="getPropertiesURL">
                      <xsl:with-param name="siteURL" select="$SiteURL" />
                      <xsl:with-param name="fileURL" select="./PATH" />
                      <xsl:with-param name="listItemId" select="./OWSID" />
                      <xsl:with-param name="action" select="'edit'" />
                    </xsl:call-template>
                  </xsl:attribute>
                  <img src="/dept/risk/Style%20Library/RegalNetBranding/Images/properties.png" style="display: inline; margin-left: auto; margin-right: auto; border:none;" />
                </a>
              </td>
            <xsl:variable name="row" select="."/>
            <xsl:for-each select="$DisplayFieldsNodes">
              <xsl:variable name="colName" select="."/>
              <xsl:variable name="tdPosition" select="position()"/>
              <xsl:variable name="dataType" select="$DisplayTypesNodes[position()=$tdPosition]" />
              <td>
                <xsl:choose>
                  <xsl:when test="$dataType='date'">
                    <xsl:value-of select="ddwrt:FormatDate($row/*[name()=$colName], 1033, 1)"/>
                  </xsl:when>
                <xsl:otherwise>
                  <xsl:value-of select="$row/*[name()=$colName]"/>
                </xsl:otherwise>
                </xsl:choose> 
              </td>
            </xsl:for-each>
          </tr>
        </xsl:for-each>
      </table>
        <div class="pagingContainer">
          <div class="pagingItem">
            <xsl:if test="$StartAt - $LimitRows&gt;0">
              <a class="paging" data-direction="backward" href="#">
                &#9668;&#160;Prev Page <!-- Space and ◄ -->
              </a>
            </xsl:if>
        </div>
        <div class="pagingItem">
            &#160;
          <span style="margin-right:5px;">
            Page
            <input name="pageNumberJump" type="text" size="1" value="{$CurrentPage}" />
            of <xsl:value-of select="$TotalPages"/>
          </span>
          <button id="btnJumpTo">Go</button>
          &#160;
        </div>
        <div class="pagingItem">
          <xsl:if test="($StartAt + $LimitRows)&lt;$MatchingResults">
            <a class="paging" data-direction="forward" href="#">
            Next Page&#160;&#9658; <!-- Space and ► -->
            </a>
          </xsl:if>
        </div> 
      </div>
  </div>

  </xsl:template>

  <!-- Converts a delimited list into XML -->
  <xsl:template name="DelimToXML">
    <xsl:param name="list" select="''"/>
    <xsl:param name="delim" select="','"/>"

    <xsl:if test="$list!=''">
        <item>
          <xsl:choose>
            <xsl:when test="contains($list, $delim)">
              <xsl:value-of select="normalize-space(substring-before($list,','))"/>
            </xsl:when>
            <xsl:otherwise>
              <xsl:value-of select="normalize-space($list)"/>
            </xsl:otherwise>
          </xsl:choose>
        </item>
        <xsl:call-template name="DelimToXML">
          <xsl:with-param name="list" select="normalize-space(substring-after($list,','))"/>
          <xsl:with-param name="delim" select="$delim"/>
        </xsl:call-template>
      <xsl:value-of select="normalize-space(substring-after($list,','))"/>
        
    </xsl:if>
  </xsl:template>
  
  <xsl:template name="getPropertiesURL">
    <xsl:param name="siteURL" />
    <xsl:param name="fileURL" />
    <xsl:param name="listItemId" />
    <xsl:param name="action" />
    <xsl:variable name="destPage">
      <xsl:choose>
        <xsl:when test="$action='properties'">
          <xsl:value-of select="'/Forms/DispForm.aspx?id='"/>
        </xsl:when>
        <xsl:when test="$action='edit'">
          <xsl:value-of select="'/Forms/EditForm.aspx?id='"/>
        </xsl:when>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="library">
      <xsl:call-template name="getLibraryName">
              <xsl:with-param name="siteURL" select="$siteURL"/>
              <xsl:with-param name="fileURL" select="$fileURL" />
            </xsl:call-template>
    </xsl:variable>
    <xsl:value-of select="concat($siteURL, '/', $library, $destPage, $listItemId)" />
  </xsl:template>

    
    
  <xsl:template name="getLibraryName">
    <xsl:param name="siteURL" />
    <xsl:param name="fileURL" />
    <xsl:variable name="smallcase" select="'abcdefghijklmnopqrstuvwxyz'" /> 
    <xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" /> 
    <xsl:value-of select="substring-before(concat(substring-after(translate($fileURL, $uppercase, $smallcase), concat(translate($siteURL, $uppercase, $smallcase), '/')), '/'), '/')" /> 
  </xsl:template>

  <xsl:template name="toLowercase">
    <xsl:param name="text" select="''"/>
    <xsl:variable name="smallcase" select="'abcdefghijklmnopqrstuvwxyz'" />
    <xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" />
    <xsl:value-of select="translate($text,$uppercase, $smallcase)"/>
  </xsl:template>
 
  <xsl:template name="toUppercase">
    <xsl:param name="text" select="''"/>
    <xsl:variable name="smallcase" select="'abcdefghijklmnopqrstuvwxyz'" />
    <xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" />
    <xsl:value-of select="translate($text,$smallcase, $uppercase)"/>
  </xsl:template>
    
  <xsl:template match="@* | node()">
    <xsl:copy>
      <xsl:apply-templates select="@* | node()"/>
    </xsl:copy>
  </xsl:template>
</xsl:stylesheet>
