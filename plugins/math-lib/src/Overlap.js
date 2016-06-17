(function(w){
    w.Overlap = {
        circleLine: function (circle, line) {
            var med = Math.med(line.pa, line.pb);
            var degree = Math.degreeFromVec(line.pa, line.pb);
            var va = Math.rotate(line.pa, -degree, med);
            var vb = Math.rotate(line.pb, -degree, med);
            var cc = Math.rotate({x: circle.x, y: circle.y}, -degree, med);
            var cpMiny = Math.min(line.pa.y, line.pb.y);
            var cpMaxy = Math.max(line.pa.y, line.pb.y);
            var cpMinx = Math.min(line.pa.x, line.pb.x);
            var cpMaxx = Math.max(line.pa.x, line.pb.x);
            var minX = cpMinx - circle.radius;
            var minY = cpMiny - circle.radius;
            var maxX = cpMaxx + circle.radius;
            var maxY = cpMaxy + circle.radius;
            return (((cc.x <= va.x && cc.x >= minX) || (cc.x >= va.x && cc.x <= maxX)) && (cc.t <= maxY && cc.y >= minY));
        },
        circlePoint: function (circle, pt) {
            var distance = Math.distance(pt, {x: circle.x, y: circle.y});
            return distance <= circle.radius;
        },
        shapePoint: function (shape, point) {
            switch (shape.type) {
                case 'rect':
                    return this.rectPoint(shape, point);
                    break;
                case 'circle':
                    return this.circlePoint(shape, point);
                    break;
                case 'polygon':
                    return this.pointOnPolygon(shape, point);
                    break;
            }
            return false;
        },
        rectPoint: function (rect, pt) {
            var xo = rect.x;
            var yo = rect.y;
            var xf = rect.x + rect.width;
            var yf = rect.y + rect.height;
            return (xo <= pt.x && yo <= pt.y && xf >= pt.x && yf >= pt.y);
        },
        circleRect: function (circle, rect) {
            var pa = {x: rect.x, y: rect.y};
            var pc = {x: rect.x + rect.width, y: rect.y + rect.height};

            if (circle.x >= pa.x && circle.x <= pc.x && circle.y >= pa.y && circle.y <= pc.y) {
                return true;
            }
            var pb = {x: rect.x + rect.width, y: rect.y};
            var pd = {x: rect.x, y: rect.y + rect.height};
            var la = {pa: pa, pb: pb};
            var lb = {pa: pb, pb: pc};
            var lc = {pa: pc, pb: pd};
            var ld = {pa: pd, pb: pa};

            return (
                this.circleLine(circle, la) ||
                this.circleLine(circle, lb) ||
                this.circleLine(circle, lc) ||
                this.circleLine(circle, ld)
            );
        },
        rectIntersectRect: function (rectA, rectB) {
            var x0a = rectA.x;
            var y0a = rectA.y;
            var x1a = rectA.x + rectA.width;
            var y1a = rectA.y + rectA.height;
            var x0b = rectB.x;
            var y0b = rectB.y;
            var x1b = rectB.x + rectB.width;
            var y1b = rectB.y + rectB.height;
            return !(x0a > x1b || x1a < x0b || y0a > y1b || y1a < y0b);
        },
        pointOnPolygon: function (shape, pt) {
            var poly = shape.vertices;
            for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
                ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
                && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
                && (c = !c);
            return c;
        }
    };
})(window);
