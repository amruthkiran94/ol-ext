import {equal} from "./GeomUtils";
import ol_geom_LineString from "ol/geom/LineString";

/** Split a lineString by a point or a list of points
 *	NB: points must be on the line, use getClosestPoint() to get one
 * @param {ol.Coordinate | Array<ol.Coordinate>} pt points to split the line
 * @param {Number} tol distance tolerance for 2 points to be equal
 */
ol_geom_LineString.prototype.splitAt = function(pt, tol)
{	if (!pt) return [this];
    if (!tol) tol = 1e-10;
    // Test if list of points
    if (pt.length && pt[0].length)
    {	var result = [this];
        for (var i=0; i<pt.length; i++)
        {	var r = [];
            for (var k=0; k<result.length; k++)
            {	var ri = result[k].splitAt(pt[i], tol);
                r = r.concat(ri);
            }
            result = r;
        }
        return result;
    }
    // Nothing to do
    if (equal(pt,this.getFirstCoordinate())
        || equal(pt,this.getLastCoordinate()))
    {	return [this];
    }
    // Get
    var c0 = this.getCoordinates();
    var ci=[c0[0]], p0, p1;
    var c = [];
    for (var i=0; i<c0.length-1; i++)
    {	// Filter equal points
        if (equal(c0[i],c0[i+1])) continue;
        // Extremity found
        if (equal(pt,c0[i+1]))
        {	ci.push(c0[i+1]);
            c.push(new ol_geom_LineString(ci));
            ci = [];
        }
        // Test alignement
        else if (!equal(pt,c0[i]))
        {	var d1, d2;
            if (c0[i][0] == c0[i+1][0])
            {	d1 = d2 = (c0[i][1]-pt[1]) / (c0[i][1]-c0[i+1][1]);
            }
            else if (c0[i][1] == c0[i+1][1])
            {	d1 = d2 = (c0[i][0]-pt[0]) / (c0[i][0]-c0[i+1][0]);
            }
            else
            {	d1 = (c0[i][0]-pt[0]) / (c0[i][0]-c0[i+1][0]);
                d2 = (c0[i][1]-pt[1]) / (c0[i][1]-c0[i+1][1]);
            }
            if (Math.abs(d1-d2)<tol && 0<=d1 && d1<=1)
            {	ci.push(pt);
                c.push (new ol_geom_LineString(ci));
                ci = [pt];
            }
        }
        ci.push(c0[i+1]);
    }
    if (ci.length>1) c.push (new ol_geom_LineString(ci));
    if (c.length) return c;
    else return [this];
}

// import('ol-ext/geom/LineStringSplitAt')