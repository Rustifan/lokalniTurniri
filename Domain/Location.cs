using System;

namespace Domain
{
    public class Location
    {
        public Guid Id { get; set; }
        public string FormattedLocation { get; set; }
        public string LocationString { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }
    }
}