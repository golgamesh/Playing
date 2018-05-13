<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl"
>
  <xsl:output method="html" indent="no" />

  <xsl:template name="unescape">
    <xsl:param name="escaped"/>
    <xsl:choose>
      <xsl:when test="contains($escaped,'&lt;')">
        <xsl:variable name="beforeelem" select="substring-before($escaped,'&lt;')"/>
        <xsl:variable name="elemname1" select="substring-before(substring-after($escaped,'&lt;'),' ')"/>
        <xsl:variable name="elemname2" select="substring-before(substring-after($escaped,'&lt;'),'&gt;')"/>
        <xsl:variable name="elemname3" select="substring-before(substring-after($escaped,'&lt;'),'/&gt;')"/>
        <xsl:variable name="hasattributes" select="string-length($elemname1) &gt; 0 and ((string-length($elemname2)=0 or string-length($elemname1) &lt; string-length($elemname2)) and (string-length($elemname3)=0 or string-length($elemname1) &lt; string-length($elemname3)))"/>
        <xsl:variable name="elemclosed" select="string-length($elemname3) &gt; 0 and (string-length($elemname2)=0 or string-length($elemname3) &lt; string-length($elemname2))"/>
        <xsl:variable name="elemname">
          <xsl:choose>
            <xsl:when test="$hasattributes">
              <xsl:value-of select="$elemname1"/>
            </xsl:when>
            <xsl:when test="not($elemclosed)">
              <xsl:value-of select="$elemname2"/>
            </xsl:when>
            <xsl:otherwise>
              <xsl:value-of select="$elemname3"/>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:variable>
        <xsl:variable name="elemclosetag" select="concat('&lt;/',$elemname,'&gt;')"/>
        <xsl:variable name="innercontent">
          <xsl:if test="not($elemclosed)">
            <xsl:call-template name="skipper-before">
              <xsl:with-param name="source" select="substring-after(substring-after($escaped,'&lt;'),'&gt;')"/>
              <xsl:with-param name="delimiter" select="$elemclosetag"/>
            </xsl:call-template>
          </xsl:if>
        </xsl:variable>
        <xsl:variable name="afterelem">
          <xsl:choose>
            <xsl:when test="not($elemclosed)">
              <xsl:call-template name="skipper-after">
                <xsl:with-param name="source" select="substring-after(substring-after($escaped,'&lt;'),'&gt;')"/>
                <xsl:with-param name="delimiter" select="$elemclosetag"/>
              </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
              <xsl:value-of select="substring-after(substring-after($escaped,'&lt;'),'/&gt;')"/>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:variable>
        <xsl:element name="{$elemname}">
          <xsl:if test="$hasattributes">
            <xsl:call-template name="unescapeattributes">
              <xsl:with-param name="escapedattributes">
                <xsl:choose>
                  <xsl:when test="not($elemclosed)">
                    <xsl:value-of select="normalize-space(substring-after($elemname2,' '))"/>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:value-of select="normalize-space(substring-after($elemname3,' '))"/>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:with-param>
            </xsl:call-template>
          </xsl:if>
          <xsl:call-template name="unescape">
            <xsl:with-param name="escaped" select="$innercontent"/>
          </xsl:call-template>
        </xsl:element>
        <xsl:call-template name="unescape">
          <xsl:with-param name="escaped" select="$afterelem"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="unescapetext">
          <xsl:with-param name="escapedtext" select="$escaped"/>
        </xsl:call-template>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="unescapeattributes">
    <xsl:param name="escapedattributes"/>
    <xsl:variable name="attrname" select="substring-before($escapedattributes,'=')"/>
    <xsl:variable name="attrquote" select="substring($escapedattributes,string-length($attrname)+2,1)"/>
    <xsl:variable name="attrvalue" select="substring-before(substring-after($escapedattributes,$attrquote),$attrquote)"/>
    <xsl:variable name="afterattr" select="substring-after(substring-after($escapedattributes,$attrquote),$attrquote)"/>
    <xsl:attribute name="{$attrname}">
      <xsl:call-template name="unescapetext">
        <xsl:with-param name="escapedtext" select="$attrvalue"/>
      </xsl:call-template>
    </xsl:attribute>
    <xsl:if test="contains($afterattr,'=')">
      <xsl:call-template name="unescapeattributes">
        <xsl:with-param name="escapedattributes" select="normalize-space($afterattr)"/>
      </xsl:call-template>
    </xsl:if>
  </xsl:template>

  <xsl:template name="unescapetext">
    <xsl:param name="escapedtext"/>
    <xsl:call-template name="string-replace-all">
      <xsl:with-param name="text">
        <xsl:call-template name="string-replace-all">
          <xsl:with-param name="text">
            <xsl:call-template name="string-replace-all">
              <xsl:with-param name="text" select="$escapedtext"/>
              <xsl:with-param name="replace">&amp;gt;</xsl:with-param>
              <xsl:with-param name="by">&gt;</xsl:with-param>
            </xsl:call-template>
          </xsl:with-param>
          <xsl:with-param name="replace">&amp;lt;</xsl:with-param>
          <xsl:with-param name="by">&lt;</xsl:with-param>
        </xsl:call-template>
      </xsl:with-param>
      <xsl:with-param name="replace">&amp;amp;</xsl:with-param>
      <xsl:with-param name="by">&amp;</xsl:with-param>
    </xsl:call-template>
  </xsl:template>

  <!-- replaces substrings in strings -->
  <xsl:template name="string-replace-all">
    <xsl:param name="text"/>
    <xsl:param name="replace"/>
    <xsl:param name="by"/>
    <xsl:choose>
      <xsl:when test="contains($text, $replace)">
        <xsl:value-of select="substring-before($text,$replace)"/>
        <xsl:value-of select="$by"/>
        <xsl:call-template name="string-replace-all">
          <xsl:with-param name="text" select="substring-after($text,$replace)"/>
          <xsl:with-param name="replace" select="$replace"/>
          <xsl:with-param name="by" select="$by"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$text"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- returns the substring after the last delimiter -->
  <xsl:template name="skipper-after">
    <xsl:param name="source"/>
    <xsl:param name="delimiter"/>
    <xsl:choose>
      <xsl:when test="contains($source,$delimiter)">
        <xsl:call-template name="skipper-after">
          <xsl:with-param name="source" select="substring-after($source,$delimiter)"/>
          <xsl:with-param name="delimiter" select="$delimiter"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$source"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- returns the substring before the last delimiter -->
  <xsl:template name="skipper-before">
    <xsl:param name="source"/>
    <xsl:param name="delimiter"/>
    <xsl:param name="result"/>
    <xsl:choose>
      <xsl:when test="contains($source,$delimiter)">
        <xsl:call-template name="skipper-before">
          <xsl:with-param name="source" select="substring-after($source,$delimiter)"/>
          <xsl:with-param name="delimiter" select="$delimiter"/>
          <xsl:with-param name="result">
            <xsl:if test="result!=''">
              <xsl:value-of select="concat($result,$delimiter)"/>
            </xsl:if>
            <xsl:value-of select="substring-before($source,$delimiter)"/>
          </xsl:with-param>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$result"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>


</xsl:stylesheet>
