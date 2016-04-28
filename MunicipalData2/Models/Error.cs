using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
 
namespace WEB.Models
{
	public class Error
	{
		[Key]
		public DateTime Date { get; set; }

        [Column(TypeName = "varchar(MAX)")]
        public string Message { get; set; }

        [Column(TypeName = "varchar(MAX)")]
        public string Url { get; set; }

        [MaxLength(256)]
        public string UserName { get; set; }
    }
}