using System;
using System.Collections.Generic;
using System.Globalization;
using System.ComponentModel.DataAnnotations;

namespace WEB.Models 
{
    public class SettingsDTO
    {
        [MaxLength(50)]
        public string RootUrl { get; set; }
        //public decimal XXX { get; set; }
    }

    //public class Enum1DTO
    //{
    //    public int Id { get; set; }
    //    public string Name { get; set; }
    //}

    public partial class ModelFactory
    {
        public static SettingsDTO Create(Settings settings)
        {
            //var Enum1 = new List<Enum1DTO>();
            //foreach (Enum1 enum in Enum.GetValues(typeof(Enum1)))
            //    Enum1.Add(new Enum1DTO { Id = (int)status, Name = status.ToString() });

            var dto = new SettingsDTO
            {
                RootUrl = settings.RootUrl
                //xxx = settings.xxx
            };

            return dto;
        }

        public void Hydrate(Settings settings, SettingsDTO settingsDTO)
        {
            //settings.xxx = settingsDTO.xxx;
        }
    }
}